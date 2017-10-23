import tweepy #https://github.com/tweepy/tweepy
import pandas as pd
import numpy as np
import json

#Import the necessary methods from tweepy library
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream

from classifier import TrumpClassifier
from listener import TweetListener

#Twitter API credentials
consumer_key = ""
consumer_secret = ""
access_key = ""
access_secret = ""

def get_reviews(path):
    data = pd.read_json(path, lines=True)

    positive = data[data.overall >= 5].reviewText.values
    neutral = data[data.overall == 3].reviewText.values
    negative = data[data.overall <= 1].reviewText.values

    return neutral[0:1000], positive[0:1000], negative[0:1000]

class TrumpStreamer():

    def __init__(self, consumer_k, consumer_s, access_k, access_s):
        self.__data = []
        self.__auth = OAuthHandler(consumer_k, consumer_s)
        self.__auth.set_access_token(access_k, access_s)
        self.__trumpifier = TrumpClassifier()

        neut, pos, neg = get_reviews('reviews.json')
        X_train = np.hstack([pos, neg, neut])
        y_train = np.hstack([np.zeros(len(pos)), np.ones(len(neg)), np.ones(len(neut))+1])
        self.__trumpifier.train(X_train, y_train)

    def collect(self, keywords, max_tweets=10000):
        listener = TweetListener('./tweets.json', self.__trumpifier, max_tweets)
        stream = Stream(self.__auth, listener)
        stream.filter(track=keywords)

def main():
    #initializes streamer 
    streamer = TrumpStreamer(consumer_key, consumer_secret, access_key, access_secret)

#collect tweets undefinetely
    while True:
#each time the collect method is called, #max_tweets are retrivied from a real time stream.
#on each iteration the previously collected tweets are erased, in order to keep
#only the newest tweets. After the first iteration it is guaranteed that the output file
#contains #max_tweets.
        streamer.collect(['realDonaldTrump'], max_tweets=5000)


if __name__ == '__main__':
    main()



