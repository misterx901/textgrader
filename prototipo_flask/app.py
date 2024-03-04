from flask import Flask,render_template,request,redirect,url_for
from functions import evaluate_redacao

app = Flask(__name__)


@app.route('/')
def home():
    return "elefante"


@app.route('/redacao',methods = ['GET','POST'])
def redacao():
    if request.method == 'POST':

        redacao = request.form['redacao']

        nota1,nota2,nota3,nota4,nota5 = evaluate_redacao(redacao)



        return redirect(url_for('notas', nota1 = nota1,
                                         nota2 = nota2,
                                         nota3 = nota3,
                                         nota4 = nota4,
                                         nota5 = nota5))
    
    return render_template('redacao.html')


@app.route('/<nota1> <nota2> <nota3> <nota4> <nota5>')
def notas(nota1,nota2,nota3,nota4,nota5):
    return render_template('exibe.html',nota1 = nota1,
                           nota2 = nota2,nota3 = nota3, nota4 = nota4, nota5 = nota5)



if __name__ == "__main__":
    from support import use_vectorizer
    app.run()


