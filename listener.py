import json
import pandas as pd
from tweepy.streaming import StreamListener

class TweetListener(StreamListener):
    tweets_att = ['text']
    user_att = ['id', 'location']

    def __init__(self, output, classifier, max_tweets, api=None):
        super(TweetListener, self).__init__()
        self.__data = []
        self.__counter = 0
        self.__max_tweets = max_tweets
        self.__classifier = classifier
        self.output_path = output

    def on_data(self, data):
        parsed = json.loads(data)
        if all(att in parsed['user'].keys() for att in self.user_att):
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
                    for att in self.user_att:
                        fields['user_'+att] = tweet['user'][att]
                    out.append(fields)
                except:
                    continue

            with open(self.output_path, 'w+') as outfile:
                tweets = pd.read_json(json.dumps(out))
                tweets['sentiment'] = self.__classifier.predict(tweets['text'])
                tweets = tweets.drop('text', axis=1)
                tweets.to_json(outfile, orient='records')

            return False


        return True
