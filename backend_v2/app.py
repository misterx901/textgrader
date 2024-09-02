from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from functions import use_vectorizer, evaluate_redacao, persist_essay, get_text
from flask_cors import CORS
import bcrypt

app = Flask(__name__)
CORS(app) 

#se estiver executando a aplicação por docker
client = MongoClient('host.docker.internal',27017)

#se estiver executando sem o docker
#client = MongoClient('localhost',27017)

db = client.TextGrader

@app.route("/")
def primeiro_endpoint_get():
  return ("OK!", 200) 

@app.post("/model")
def segundo_endpoint():
    essay = request.json['essay']
    id_tema = request.json['id']
    aluno = request.json['aluno']
    
    lines = essay.split('\n')
    title = lines[0] if lines else "Título não fornecido"
    
    rest_of_essay = '\n'.join(line for line in lines[1:] if line.strip())

    obj = evaluate_redacao(essay)

    grades = {
        "nota1": float(obj.get('nota_1', 0)),
        "nota2": float(obj.get('nota_2', 0)),
        "nota3": float(obj.get('nota_3', 0)),
        "nota4": float(obj.get('nota_4', 0)),
        "nota5": float(obj.get('nota_5', 0))
    }

    essay_data = {
        "titulo": title,
        "texto": rest_of_essay.strip(),  
        "nota1": grades['nota1'],
        "nota2": grades['nota2'],
        "nota3": grades['nota3'],
        "nota4": grades['nota4'],
        "nota5": grades['nota5'],
        "notaprofessor": "",
        "id_tema":  id_tema,
        "aluno": aluno
    }
    
    redacoes_collection = db.redacoes
    redacao_id = redacoes_collection.insert_one(essay_data).inserted_id
    
    response = jsonify({"grades": obj})
    response.headers.add('Access-Control-Allow-Origin', '*')

    persist_essay(essay, obj)
    return response
  
@app.post("/model2")
def terceiro_endpoint():
    image = request.files['image']
    print('imagem', image)
    id_tema = request.form.get('id')
    aluno = request.form.get('aluno')

    print('aluno', aluno)
    
    essay = get_text(image)

    obj = evaluate_redacao(essay)

    grades = {
        "nota1": float(obj.get('nota_1', 0)),
        "nota2": float(obj.get('nota_2', 0)),
        "nota3": float(obj.get('nota_3', 0)),
        "nota4": float(obj.get('nota_4', 0)),
        "nota5": float(obj.get('nota_5', 0))
    }

    essay_data = {
        "titulo": "Redação de imagem",
        "texto": essay,  
        "nota1": grades['nota1'],
        "nota2": grades['nota2'],
        "nota3": grades['nota3'],
        "nota4": grades['nota4'],
        "nota5": grades['nota5'],
        "notaprofessor": "",
        "id_tema":  id_tema,
        "aluno": aluno
    }
    
    redacoes_collection = db.redacoes
    redacao_id = redacoes_collection.insert_one(essay_data).inserted_id
    
    response = jsonify({"grades": obj})
    response.headers.add('Access-Control-Allow-Origin', '*')

    persist_essay(essay, obj)
    return response
  
  
@app.post("/userRegister")
def create_user():
    user_data = request.json
    
    if 'email' not in user_data or 'password' not in user_data or 'nomeUsuario' not in user_data:
        return jsonify({"error": "Dados insuficientes"}), 400

    hashed_password = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt())
    
    users_collection = db.users

    user_id = users_collection.insert_one({
        "email": user_data['email'],
        "password": hashed_password,
        "username": user_data['nomeUsuario'],
        "tipoUsuario": user_data.get('tipoUsuario', 'usuario')  
    }).inserted_id
    
    return jsonify({"message": "Usuário criado com sucesso", "user_id": str(user_id)}), 201
  
  
@app.post("/userLogin")
def login():
    user_data=request.json

    if 'email' not in user_data or 'password' not in user_data:
        return jsonify({"error": "Dados insuficientes"}), 400

    users_collection = db.users
    user = users_collection.find_one({"email": user_data['email']})
    
    if user:        
        if bcrypt.checkpw(user_data['password'].encode('utf-8'), user['password']):
            return jsonify({
                "tipoUsuario": user.get('tipoUsuario', 'usuario'),
                "nomeUsuario": user.get('username')
            }), 200
        else:
            return jsonify({"error": "Email ou senha incorretos"}), 401

    return jsonify({"error": "Usuário não encontrado"}), 404

@app.get("/users/alunos")
def get_alunos():
    users_collection = db.users
    alunos = list(users_collection.find({"tipoUsuario": "aluno"}))
    
    for aluno in alunos:
        aluno['_id'] = str(aluno['_id'])  # Convertendo ObjectId para string
        aluno.pop('password', None)  # Remove o campo 'password' para evitar problemas com bytes
    
    response = jsonify(alunos)
    response.headers.add('Access-Control-Allow-Origin', '*')
    
    return response



@app.get("/temas")
def get_temas():
    temas_collection = db.temas
    temas = list(temas_collection.find())
    for tema in temas:
        tema['_id'] = str(tema['_id']) 
    return jsonify(temas)

@app.post("/temas")
def create_tema():
    tema_data = request.json
    if 'nome_professor' not in tema_data or 'tema' not in tema_data or 'descricao' not in tema_data:
        return jsonify({"error": "Dados insuficientes"}), 400
    
    temas_collection = db.temas
    tema_id = temas_collection.insert_one(tema_data).inserted_id
    return jsonify({"message": "Tema criado com sucesso", "tema_id": str(tema_id)}), 201


@app.put("/temas/<id>")
def update_tema(id):
    temas_collection = db.temas 
    
    try:
        object_id = ObjectId(id) 
        data = request.json
        
        result = temas_collection.update_one(
            {"_id": object_id},
            {"$set": {
                "tema": data.get("tema"),
                "descricao": data.get("descricao"),
                "nome_professor": data.get("nome_professor")
            }}
        )
        
        if result.matched_count == 1:
            if result.modified_count == 1:
                return jsonify({"message": "Tema atualizado com sucesso!"}), 200
            else:
                return jsonify({"message": "Nada foi atualizado."}), 304
        else:
            return jsonify({"error": "Tema não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
      
@app.delete("/temas/<id>")
def delete_tema(id):
    temas_collection = db.temas
    try:
        object_id = ObjectId(id) 
        result = temas_collection.delete_one({"_id": object_id})#

        if result.deleted_count == 1:
            return jsonify({"message": "Tema deletado com sucesso!"}), 200
        else:
            return jsonify({"error": "Tema não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.get("/redacoes")
def get_redacoes():
    redacoes_collection = db.redacoes
    redacoes = list(redacoes_collection.find())
    for redacao in redacoes:
        redacao['_id'] = str(redacao['_id']) 
    return jsonify(redacoes)

@app.post("/redacoes")
def create_redacao():
    redacao_data = request.json
    if 'titulo_redacao' not in redacao_data or 'id_tema' not in redacao_data:
        return jsonify({"error": "Dados insuficientes"}), 400
    
    redacoes_collection = db.redacoes
    redacao_id = redacoes_collection.insert_one(redacao_data).inserted_id
    return jsonify({"message": "Redação criada com sucesso", "redacao_id": str(redacao_id)}), 201


if __name__ == "__main__":
  from support import use_vectorizer
  debug = True # com essa opção como True, ao salvar, o "site" recarrega automaticamente.
  app.run(host='0.0.0.0', port=5000, debug=debug)