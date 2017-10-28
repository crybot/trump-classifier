

# <img src="http://vectorlogo4u.com/wp-content/uploads/2016/06/twitter-icon-vector.png" width="180">#Trump Classifier
```diff
                      A Sentiment Analyzer
```


## What Am I Looking At?
``` diff
```
*Donald J. Trump* is one of the most tweeting presidents in American history. 
According to the **INDEPENDENT**:
> Mr Trump has sent almost *500* tweets from his personal **@realDonaldTrump** account, 
and a further *300* from the official **@Potus** account since his inauguration on 20 January.
That amounts to almost *5* personal tweets a day, and combined with his
official account - which is albeit mostly managed by his staff - the figure reaches *7.5*.

He tweets about a broad range of subjects, including: news channels, reporters, business organizations, his family and even individuals. His tweets usually get lots of attentions from Twitter users and main stream medias.

Our application analyzes population's real time reaction to Trump's *Twitter* activity based on the content of the tweets concerning him.

## Getting Started
``` diff
```
For the joy of lazy people, there's no installing going on. Just visit the application and get some insights about Trump's daily activity!

[Click Me :D](http://washeramedia.com/)

## Features
``` diff
```
Once the page has loaded (it may take a while depending on the amount of data points to be processed), you may choose between 4 different kinds of charts:

* USA/World Wide Chart

![USA Map](https://media.giphy.com/media/l1J9GI4It9cmqS3y8/giphy.gif)
* Bar Chart (Fun Fact: The original idea was to use Trump's faces to plot sentiments, but it may have been of bad taste to someone)
 
![Bar Chart](https://media.giphy.com/media/3ov9jY32DrHyIkghTG/giphy.gif)
* Pie Chart

![Pie Chart](https://media.giphy.com/media/3o7aDeAXNlvwb58n1S/giphy.gif)

## Some Results
``` diff
```
### What People Think of Trump
Incredibly enough (perhaps not), we showed that:
> 32% of the population do have a positive attitude towards *Donald J. Trump*; 47% of the population expresses negative feelings about his Twitter activity, whereas 21 % of the population is neutral. Our results are also in line with the current approval rate of *Trump*, which is 36 % ([Presidential approval ratings](http://news.gallup.com/poll/203198/presidential-approval-ratings-donald-trump.aspx))

### Is It Realistic?
As mentioned above, the current polls indicates that Trump's approval rating (as 27/10/2017) is around 36% which is really close to our Sentimental Analyzer prediction.

![Trump's approval ratings](https://image.ibb.co/fa4FMR/Screenshot_8.png)


### About Geolocalization
While trying to extract geographic information out of Twitter's data, we realized that only about 2% of the tweets collected included non-null coordinates. This would be worth investigating deeper: People are so smart that whenever they can, they turn off geolocalization, or they just don't know how to turn it on?
Argue.

## Additional Notes
``` diff
Just some technical stuff, feel free to skip it.
```

### Application Architecture
![Architecture](https://image.ibb.co/h4XzFm/architecture.png)

### Data Collection
The application uses Tweepy to connect to Twitter's data stream and collect users posts in real time.
Tweets are then saved periodically into two different csv formatted files to allow for faster retrivial while visualizing them: one file contains all the tweets collected so far, while the other includes only the ones with non-null geographic coordinates.

### Text Processing
Before feeding the data to our classifier, the application preprocesses the data following these steps:
* The text gets stemmed, including stopwords removal and lowercase transformation
* The resulting sentence gets then "unbiased" by replacing occurrences of the word 'Trump' with a pronoun (since the training set did not include such words. More on this later)
* The sentence gets finally vectorized using a tf-idf transformer and fed to the classifier.

### Sentiment Analysis
Our classifier is implemented as a Multinomial Naive Bayes Classifier. It has been trained with Amazon's Instant video reviews to determine the class of a certain sentence among 'positive', 'neutral' or 'negative'.

### Data Visualization
For our visualizer we used D3.js and wrote a dynamic web page to visualize in real time the analyzed tweets.

### Built With
* Python: data collection and machine learning
* Javascript: data visualization

### Versioning
We used git to keep track of the group workflow

### Authors (in Alphabetical order)

* [Asabeneh](https://github.com/Asabeneh)
* [Marco](https://github.com/crybot)
* [Tiina](https://github.com/kummakki)

### License
The project is under GPL-3.0 License. See [LICENSE](https://github.com/crybot/trump-classifier/blob/master/LICENSE) for more information.
