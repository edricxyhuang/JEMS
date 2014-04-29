import nltk


def comp_sent(sent1, sent2):
    sent1 = nltk.word_tokenize(sent1) 
    sent2 = nltk.word_tokenize(sent2)
    pts_spch1 = nltk.pos_tag(sent1)
    pts_spch2 = nltk.pos_tag(sent2)

    return 1

a = "he crossed the street and jumped over a passing car"    
b = "he ran across the street and scaled an oncoming vehicle"
