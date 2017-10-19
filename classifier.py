from sklearn.naive_bayes import MultinomialNB, GaussianNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.pipeline import Pipeline

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
                X[i] = X[i].replace('Trump', 'he')
            except:
                continue
        return X


class TrumpClassifier:
    model = text_clf = Pipeline([('vect', CountVectorizer()),
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

    def predict(self, X):
        return [self.classes[h] for h in self.model.predict(X)]

    def score(self, X, y):
        return self.model.score(X, y)

    def params(self, X, y):
        pass

    def set_params(self, X, y):
        pass


