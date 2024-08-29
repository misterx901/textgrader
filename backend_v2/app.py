from flask import Flask, request, jsonify
from functions import use_vectorizer, evaluate_redacao, persist_essay, get_text
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

@app.route("/")
def primeiro_endpoint_get():
  return ("OK!", 200) 

@app.post("/model")
def segundo_endpoint():
    essay = request.json['essay']
    
    obj = evaluate_redacao(essay)

    response = jsonify({"grades": obj})
    response.headers.add('Access-Control-Allow-Origin', '*')

    persist_essay(essay, obj)
    return response
  
@app.post("/model2")
def terceiro_endpoint():
    
    image = request.files['image']
    essay = get_text(image)
    print(essay)
    obj = evaluate_redacao(essay)
    response = jsonify({"grades": obj})
    response.headers.add('Access-Control-Allow-Origin', '*')

    persist_essay(essay, obj)
    return response

if __name__ == "__main__":
  from support import use_vectorizer
  debug = True # com essa opção como True, ao salvar, o "site" recarrega automaticamente.
  app.run(host='0.0.0.0', port=5000, debug=debug)