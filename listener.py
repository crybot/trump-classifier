import json
import pandas as pd
from tweepy.streaming import StreamListener
import os

class TweetListener(StreamListener):
    #tweets_att = ['text', 'created_at', 'in_reply_to_status_id_str', 'is_quote_status']
    tweets_att = ['text']
    #user_att = ['name', 'id_str', 'location']

    def __init__(self, output, output_coordinates, classifier, max_tweets, api=None):
        super(TweetListener, self).__init__()
        self.__data = []
        self.__counter = 0
        self.__max_tweets = max_tweets
        self.__classifier = classifier
        self.output_path = output
        self.coordinates_path = output_coordinates

    def on_data(self, data):
        parsed = json.loads(data)
        self.__data.append(parsed)
        self.__counter += 1
        print('tweets collected: %d' % self.__counter)

        if self.__counter >= self.__max_tweets:
            out = []
            for tweet in self.__data:
                try:
                    fields = {}
                    for att in self.tweets_att:
                        fields[att] = tweet[att]

                    fields['coordinates'] = None
                    if tweet['place']:
                        fields['coordinates'] = tweet['place']['bounding_box']['coordinates']

                    out.append(fields)

                except:
                    continue

            if os.path.isfile(self.output_path):
                if os.path.getsize(self.output_path) // (2**20) > 10:
                    tweets = pd.read_csv(self.output_path)
                    tweets = tweets[self.__max_tweets:]
                    tweets.to_csv(self.output_path, mode='w', index=False, header=True)

            if os.path.isfile(self.coordinates_path):
                if os.path.getsize(self.coordinates_path) // (2**20) > 5:
                    tweets = pd.read_csv(self.coordinates_path)
                    tweets = tweets[self.__max_tweets:]
                    tweets.to_csv(self.coordinates_path, mode='w', index=False, header=True)

            headers1 = (not os.path.isfile(self.output_path)
                        or os.path.getsize(self.output_path) == 0)
            headers2 = (not os.path.isfile(self.coordinates_path)
                        or os.path.getsize(self.coordinates_path) == 0)
            tweets = pd.read_json(json.dumps(out))
            tweets['sentiment'] = self.__classifier.predict(tweets['text'])
            tweets = tweets.drop('text', axis=1)
            tweets.to_csv(self.output_path, mode='a+', index=False, header=headers1)
            coordinates = tweets[~tweets['coordinates'].isnull()]
            coordinates.to_csv(self.coordinates_path, mode='a+', index=False, header=headers2)

            return False

        return True

    def on_error(self, status_code):
        return True



