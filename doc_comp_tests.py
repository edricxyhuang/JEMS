import nltk

#check for exact matches between two documents -- most of what turnitin is doing now
def check_plagarism(doc1_file, doc2_file):
    
    doc1_txt = open(doc1_file,"r")
    doc1 = doc1_txt.read()
    doc2_txt = open(doc2_file,"r")
    doc2 = doc2_txt.read()
    
    matched_phrases = []

    for line1 in doc1:
        for line2 in doc2: 
            doc1_tokens = nltk.word_tokenize(line1)
            doc2_tokens = nltk.word_tokenize(line2)
            if(len(doc1_tokens) < 8 or len(doc2_tokens) < 8):
                break
            for i in range(len(doc1_tokens)-8):
                for g in range(len(doc2_tokens)-8):
                    print [i,g]
                    matches = [x==y for (a,b) in zip(doc1_tokens[i:7+i], doc2_tokens[g:g+7])]
                    [matched_phrases.append(match) for match in matches if match]
    
    doc1_txt.close()
    doc2_txt.close()

    return matched_phrases

plagarism = check_plagarism("doc1_test.txt", "doc2_test.txt")
print plagarism
