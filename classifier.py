from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.pipeline import Pipeline

class TrumpClassifier:
    model = text_clf = Pipeline([('vect', CountVectorizer()),
                                 ('tfidf', TfidfTransformer()),
                                 ('clf', MultinomialNB())
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


