import nltk

#check for exact matches between two documents -- most of what turnitin is doing now
def check_plagarism(doc1_file, doc2_file):
    
    doc1_txt = open(doc1_file,"r")
    doc1 = doc1_txt.read()
    doc2_txt = open(doc2_file,"r")
    doc2 = doc2_txt.read()
    
    matched_phrases = []
   
    for line1 in doc1.split('\n'):
        for line2 in doc2.split('\n'): 
            doc1_tokens = line1.split()#nltk.word_tokenize(line1)
            doc2_tokens = line2.split()#nltk.word_tokenize(line2)
            if(len(doc1_tokens) < 8 or len(doc2_tokens) < 8):
                break
            for i in range(len(doc1_tokens)-7):
                for g in range(len(doc2_tokens)-7):
                    #if doc1_tokens[i] == doc2_tokens[g]:
                    matches = [doc2_tokens[g+h] for h in range(len(doc2_tokens)-7-g) if doc1_tokens[i+h] == doc2_tokens[g+h] ]
                    index = 0
                    while(index < len(matches) and matches[index]):
                        index += 1
                    matches = matches[:index]
                    if len(matches) > 7:
                        matched_phrases.append(" ".join(matches))
                    
                    # matches = [a for (a,b) in zip(doc1_tokens[i:7+i], doc2_tokens[g:g+7]) if a==b]
                    # if len(matches) == 7:    
                    #     # return [ [line number, char number], 
                    #     #matched_phrases.append([[doc1.split('\n').index(line2),line2.index(doc2_tokens[g:g+7])],doc2_tokens[g:g+7]])
                    #     phrase = doc2_tokens[g:g+7]
                    #     matched_phrases.append(doc2_tokens[g:g+7])
                        
                        
    
    doc1_txt.close()
    doc2_txt.close()

    return matched_phrases

plagarism = check_plagarism("doc1_test.txt", "doc2_test.txt")
print plagarism
