import os, nltk, requests

import pandas as pd

from urllib import request

def setup_ntlk():
  nltk.download('punkt')

  print('NLTK PUNKT setup finished')

ESSAY_PATH = 'datalake/essay/raw'
SHORT_ANSWER_PATH = 'datalake/short_answer/raw'

ESSAY_FILE = f"{ESSAY_PATH}/essays.csv"
ESSAY_FILE1 = f"{ESSAY_PATH}/essays1.csv"
SHORT_ANSWER_FILE = f"{SHORT_ANSWER_PATH}/short_answers.xlsx"

def create_datalake_dirs():
  os.makedirs(ESSAY_PATH, exist_ok=True)
  os.makedirs(SHORT_ANSWER_PATH, exist_ok=True)

def download_essays():
  ESSAY_LINK = 'https://zenodo.org/record/7641696/files/essays.xlsx?download=1'

  if os.path.isfile(ESSAY_FILE) == False:
    request.urlretrieve(ESSAY_LINK, ESSAY_FILE)

def download_short_answers():
  SHORT_ANSWER_LINK = 'https://zenodo.org/record/7641696/files/short_answers.xlsx?download=1'

  if os.path.isfile(SHORT_ANSWER_FILE) == False:
    request.urlretrieve(SHORT_ANSWER_LINK, SHORT_ANSWER_FILE)

def create_default_datalake():
  create_datalake_dirs()
  download_essays()
  download_short_answers()

def get_themes():
  ## getting themes
  theme_url ='https://raw.githubusercontent.com/vansoares/redacoes-crawler/main/redacoes_enem/redacoes_enem/results/temas-contexto.json'
  themes_json = requests.get(theme_url).json()
  for t in themes_json:
      #try:
      if "context" in themes_json[t] and themes_json[t]["context"]  != "":
          title = themes_json[t]["title"]
          date = themes_json[t]["data"]
          context = themes_json[t]["context"]
          #theme = dbManager.create_theme(title, date, context)

      #except IntegrityError as e:
      #    assert isinstance(e.orig, UniqueViolation)  # proves the original exception
      #    print('Ja existe: {}'.format(themes_json[t]["title"]))
      #    continue

  print('-'*50)
  print('TEMAS SALVOS')
  print('-'*50)

def get_essays():
  CORPUS_ESSAYS = []
  url = 'https://raw.githubusercontent.com/vansoares/redacoes-crawler/main/redacoes_enem/redacoes_enem/results/tema-{}.json'

  ESSAY_XLSX_COLUMNS = 'essay_id essay_set essay rater1_domain1 rater2_domain1 rater3_domain1 domain1_score rater1_domain2 rater2_domain2 domain2_score rater1_trait1 rater1_trait2 rater1_trait3 rater1_trait4 rater1_trait5 rater1_trait6 rater2_trait1 rater2_trait2 rater2_trait3 rater2_trait4 rater2_trait5 rater2_trait6 rater3_trait1 rater3_trait2 rater3_trait3 rater3_trait4 rater3_trait5 rater3_trait6'.split(' ')

  corpus_essays_dict = {}

  for column in ESSAY_XLSX_COLUMNS:
    corpus_essays_dict[column] = []


  for i in range(1, 10):
      theme_url = url.format(i)
      print(theme_url)
      response = requests.get(theme_url)

      if response.status_code != 200:
        print(f"Unable to get data from this url: {theme_url}")
        continue

      content_json = response.json()

      try:
        for essay in content_json:
          corpus_essays_dict['essay_id'].append(essay['id'])
          #corpus_essays_dict['essay_set'].append(1)
          corpus_essays_dict['essay'].append(essay['texto'])
          corpus_essays_dict['domain1_score'].append(essay['nota'])
            #theme = dbManager.get_theme_by_name(essay["tema"])
            #essay = dbManager.create_essays(essay, theme)

      except Exception as e:
          print ('ERROR: deu ruim pegando a msg')   

  print('-'*50)
  print('REDACOES SALVAS')
  print('-'*50)

  corpus_essay_dataframe = pd.DataFrame.from_dict(pd.DataFrame(dict([ (k,pd.Series(v)) for k,v in corpus_essays_dict.items() ])))
  corpus_essay_dataframe.to_csv(ESSAY_FILE1, index=False)


  return corpus_essay_dataframe

def download_and_convert_brasil_escola_corpus_essay():

  #get_themes()
  get_essays()

  #print(len(CORPUS_ESSAYS))

def download_and_convert_uol_corpus_essays():
  print("ESTA ENTRANDO NA UOL")
  if os.path.isfile(ESSAY_FILE) == True: return

  essay_link = 'https://raw.githubusercontent.com/cassiofb-dev/corpus-redacoes-uol/master/corpus/uoleducacao_redacoes_'
  
  ESSAY_XLSX_COLUMNS = 'essay_id essay_set essay rater1_domain1 rater2_domain1 rater3_domain1 domain1_score rater1_domain2 rater2_domain2 domain2_score rater1_trait1 rater1_trait2 rater1_trait3 rater1_trait4 rater1_trait5 rater1_trait6 rater2_trait1 rater2_trait2 rater2_trait3 rater2_trait4 rater2_trait5 rater2_trait6 rater3_trait1 rater3_trait2 rater3_trait3 rater3_trait4 rater3_trait5 rater3_trait6'.split(' ')

  corpus_essays_dict = {}

  for column in ESSAY_XLSX_COLUMNS:
    corpus_essays_dict[column] = []

  essay_id = 0

  for k in range(1, 10):
    print('entrou no for')
    
    url = f'{essay_link}{k}.json'
    print(url)

    corpus_essays = requests.get(url)
    if corpus_essays.status_code != 200 :
      print(f"Unable to get data from this url: {url}")
      continue

    for essay in corpus_essays:
      essay_id += 1

      if len(essay['texto']) == 0: continue

      corpus_essays_dict['essay_id'].append(essay_id)
      corpus_essays_dict['essay_set'].append(1)
      corpus_essays_dict['essay'].append(essay['texto'])
      corpus_essays_dict['domain1_score'].append(essay['nota'])

  # https://stackoverflow.com/questions/61255750/convert-dictionary-of-dictionaries-using-its-key-as-index-in-pandas

  print(corpus_essays_dict)

  corpus_essay_dataframe = pd.DataFrame.from_dict(pd.DataFrame(dict([ (k,pd.Series(v)) for k,v in corpus_essays_dict.items() ])))

  corpus_essay_dataframe.to_csv(ESSAY_FILE, index=False)
  return corpus_essay_dataframe

def create_corpus_datalake():
  create_datalake_dirs()
  print("DOWNLOAD UOL")
  df1 = download_and_convert_uol_corpus_essays()

  print(df1)

  print("DOWNLOAD BRASIL ESCOLA")
  df2 = download_and_convert_brasil_escola_corpus_essay()

  #df_concat = pd.concat([df1, df2])
  #df_concat.to_excel(ESSAY_FILE, index=False)



if __name__ == '__main__':
  setup_ntlk()
  create_corpus_datalake()
