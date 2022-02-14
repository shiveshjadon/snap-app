import json
import spacy
import pytextrank
nlp = spacy.load("en_core_web_sm")
nlp.add_pipe("merge_noun_chunks")
nlp.add_pipe("merge_entities")
nlp.add_pipe("textrank")

while True:
  text = input()
  doc = nlp(text)

  res = { "tokens": [], "keywords": {} }

  keywords = {}
  for phrase in doc._.phrases:
    if (phrase.rank > 0):
      keywords[phrase.text] = phrase.rank

  res["keywords"] = keywords

  for token in doc:
    rank = keywords.get(token.text, 0)
    res["tokens"].append({
      "text": token.text,
      "tag": token.tag_,
      "is_stop": token.is_stop,
      "ent_type": token.ent_type_,
      "keyword_rank": rank
    })

  print(json.dumps(res))