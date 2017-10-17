import string
import pandas as pd
import numpy as np
import numpy.random as npr
import Stemmer
from classifier import TrumpClassifier

def stem(line, stemmer, stop_words):
    words = [stemmer.stemWord(w) for w in line.split() if w not in stop_words]
    return ' '.join(words)

def process_input(data):
    stop_words = string.punctuation
    stemmer = Stemmer.Stemmer('english')
    data = list(map(lambda line: stem(line, stemmer, stop_words), data))
    for punctuation in string.punctuation:
        data = [line.replace(punctuation, '') for line in data]
    return data


def get_reviews(path):
    data = pd.read_json(path, lines=True)
    data.reviewText = data.reviewText.str.lower()

    positive = process_input(data[data.overall >= 5].reviewText.values)
    neutral = process_input(data[data.overall == 3].reviewText.values)
    negative = process_input(data[data.overall <= 1].reviewText.values)

    return neutral[0:1000], positive[0:1000], negative[0:1000]


def split_data(X, y, ps=[0.8, 0.2]):
    I = npr.permutation(X.shape[0])
    X = X[I]
    y = y[I]
    Xsets = []
    Ysets = []
    start = 0
    for p in ps:
        end = start + round(len(X)*p)
        Xsets.append(X[start:end])
        Ysets.append(y[start:end])
        start = end
    return (Xsets[0], Ysets[0], Xsets[1], Ysets[1])
    

def main():

    neut, pos, neg = get_reviews('reviews.json')

    X = np.hstack([pos, neg])
    y = np.hstack([np.zeros(len(pos)), np.ones(len(neg))])
    classes = {0 : 'positive', 1 : 'negative', 2 : 'neutral'}

    X_train, y_train, X_test, y_test = split_data(X, y)

    trump = TrumpClassifier()
    trump.set_classes(classes)
    trump.train(X_train, y_train)

    print("SCORE ON TEST SET: %f" % trump.score(X_test, y_test))

    #predictions = trump.predict(test_set)
    #for sentence, prediction in zip(test_set, predictions):
        #print(sentence + " : " + str(prediction))

if __name__ == '__main__':
    main()

