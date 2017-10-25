import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

def transform(x):
    if x == 'negative':
        return -1
    if x == 'neutral':
        return 0
    if x == 'positive':
        return 1

    return 0

def main():
    data = pd.read_csv('./tweets.csv')
    print("Number of Tweets: %d" % len(data))
    print("Number of Coordinates: %d" % np.sum(~data.coordinates.isnull()))
    data['sentiment'] = data['sentiment'].apply(transform)

    plt.hist(data['sentiment'][data['sentiment'] == -1], color='red', edgecolor='black', bins=3)
    plt.hist(data['sentiment'][data['sentiment'] == 0], color='yellow', edgecolor='black', bins=3)
    plt.hist(data['sentiment'][data['sentiment'] == 1], color='green', edgecolor='black', bins=3)
    plt.show()
    #print(data)

if __name__ == '__main__':
    main()

