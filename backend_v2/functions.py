import pandas as pd
import pickle
from support import use_vectorizer
import os
from datetime import datetime
import json
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from msrest.authentication import CognitiveServicesCredentials
from dotenv import load_dotenv
import os
import time
load_dotenv()


# Configure sua chave de API da AZURE
try:
    load_dotenv()
    subscription_key = os.getenv('SUBSCRIPTION_KEY')
    endpoint = os.getenv('ENDPOINT')
    computervision_client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(subscription_key))
except:
    subscription_key = os.environ('SUBSCRIPTION_KEY'),
    endpoint = os.environ('ENDPOINT')
    computervision_client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(subscription_key))


def use_vectorizer(df_train):
    vectorizer_vez = pickle.load(open('vectorizer.pkl','rb'))
    ## realiza efetivamente a vetorização, transformando em uma matriz esparsa
    X = vectorizer_vez.transform(df_train['texto'])
    
    # transforma a matriz esparsa em um dataframe organizado com as frequencias TF-IDF das palavras 
    df_vetorizado = pd.DataFrame(X.A, columns=vectorizer_vez.get_feature_names_out())

    return df_vetorizado

def evaluate_redacao(redacao):
   
    tupla = (redacao, )
    texto_df = pd.DataFrame(tupla,columns = ['texto'])
    modelo_salvo = pickle.load(open('model.pkl','rb'))
    result = modelo_salvo.predict(texto_df)

    notas = {}
    for i in range(1,6):
        key = f"nota_{i}"
        notas[key] = result[0][i-1]

    return notas

def persist_essay(essay, grades):
    if not os.path.exists('essays'):
        os.makedirs('essays')

    now = datetime.now()
    filename = now.strftime("%Y%m%d_%H%M%S")
        
    obj = {"essay": essay, "grades": grades, "date": filename}
    with open (f'essays/{filename}.json', 'w') as f:
        json.dump(obj, f, ensure_ascii=False, indent=4)

def get_text(imagem):
    # Leia imagem do arquivo
    local_image_handwritten = imagem.stream

    # Chame API com imagem e resposta bruta (permite obter o local da operação)
    recognize_handwriting_results = computervision_client.read_in_stream(local_image_handwritten, raw=True)
    # Obtenha o local da operação (URL com ID como último apêndice)
    operation_location_remote = recognize_handwriting_results.headers["Operation-Location"]
    # Tire o ID e use para obter resultados
    operation_id = operation_location_remote.split("/")[-1]

    # Chame a API "GET" e aguarde a recuperação dos resultados
    while True:
        get_handw_results = computervision_client.get_read_result(operation_id)
        if get_handw_results.status not in ['notStarted', 'running']:
            break
        time.sleep(1)

    # salve em uma variável o texto detectado
    if get_handw_results.status == OperationStatusCodes.succeeded:
        text = ""
        for text_result in get_handw_results.analyze_result.read_results:
            for line in text_result.lines:
                text += line.text + " "
        print(text.strip())
        return text.strip()
    else:
        return "Erro"