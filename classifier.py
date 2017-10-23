from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.pipeline import Pipeline
import Stemmer as S
import string

class Densifier:
    def fit(self, X, y):
        return self

    def transform(self, X):
        return X.toarray()

class Unbiaser:
    def fit(self, X, y):
        return self

    def transform(self, X):
        for i in range(X.shape[0]):
            try:
                X[i] = X[i].replace('trump', 'he')
            except:
                continue
        return X

class WordStemmer:
    __stemmer = S.Stemmer('english')

    def __stem(self, line, stop_words):
        words = [self.__stemmer.stemWord(w) for w in line.split() if w not in stop_words]
        return ' '.join(words)

    def __process_input(self, data):
        stop_words = string.punctuation
        data = list(map(lambda line: self.__stem(line.lower(), stop_words), data))
        for punctuation in string.punctuation:
            data = [line.replace(punctuation, '') for line in data]
        return data

    def fit(self, X, y):
        return self

    def transform(self, X):
        return self.__process_input(X)


class TrumpClassifier:
    model = text_clf = Pipeline([('stemmer', WordStemmer()),
                                 ('vect', CountVectorizer()),
                                 ('tfidf', TfidfTransformer()),
                                 #('dense', Densifier()),
                                 ('unbiaser', Unbiaser()),
                                 ('bayes', MultinomialNB(alpha=0.2))
                                ])

    classes = {0 : 'positive', 1 : 'negative', 2 : 'neutral'}

    def set_classes(self, classes):
        self.classes = classes

    def train(self, X, y):
        self.model = self.model.fit(X, y)
        return self

    def predict(self, X, numeric=False):
        if numeric:
            return self.model.predict(X)
        return [self.classes[h] for h in self.model.predict(X)]

    def score(self, X, y):
        return self.model.score(X, y)

    def params(self, X, y):
        pass

    def set_params(self, X, y):
        pass


