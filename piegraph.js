function pieGraph(){

  d3.select("#map").remove();
  d3.select("#map").select("svg").remove();
  d3.select("#us-map").remove();
  d3.select("#us-map").select("svg").remove();
  d3.select("#bar-graph").remove();
  d3.select("#pie-graph").remove();
  d3.select("body").select("footer").remove();

var width = 600;
var height =400;
var svg = d3.select("body").append("svg")
.attr("id","pie-graph")
.attr("width",width)
.attr("height",height);


radius = Math.min(width, height) / 2,
g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal(['green','red','yellow']);
    var pie = d3.pie().value(function(d) {
                    return d.count;
                });

  var path = d3.arc()
               .outerRadius(radius - 10)
               .innerRadius(0);

  var label = d3.arc()
                 .outerRadius(radius)
                 .innerRadius(radius -200);

d3.csv("tweetsBarGraph.csv",function(data){
    var positive = 0
    var negative = 0;
    var neutral = 0;
    var totalSentiment =[];
    var sum = 0;
    var percentPositive = 0;
    var percentNegative = 0;
    var percentNeutral = 0;

    for(var i = 0; i < data.length;i++){
          var sentiment = data[i].sentiment;

          switch(sentiment){
              case "positive":
                      positive++;
                      break;
              case "negative":
                    negative++;
                    break;
              case "neutral":
                    neutral++;
                    break;
              default:
                  break;
          }

    }

sum += positive + negative + neutral;

totalSentiment[0] = {"sentiment":"Positive","count":positive};
totalSentiment[1] = {"sentiment":"Negative","count": negative};
totalSentiment[2] = {"sentiment":"Neutral", "count": neutral}

//Generate groups
var percent= [(positive/sum *100),negative*100/sum,neutral*100/sum];
    var arc = g.selectAll("arc")
                .data(pie(totalSentiment))
                .enter()
                .append("g")
                .attr("class", "arc")


    arc.append("path")
               .attr("d", path)
               .attr("fill", function(d,i) { return color(d.data.sentiment); })
               .attr("fill-opacity",0.55);

   arc.append("text")
             .attr("transform", function(d) {
                      return "translate(" + label.centroid(d) + ")";
              })
              .attr("class","label-text")
             .text(function(d,i) {
// var valueNew =" Count: " + d.data.count + " Sentiment:" + d.data.sentiment+" percentage: "+ percent[i].toFixed(1) + " %";
                 return percent[i].toFixed(1) + " %";

               })


          svg.append("g")
             .attr("transform", "translate(" + (width / 2 - 120) + "," +5+ ")")
             .append("text")
             .text("Public Sentiment")
             .attr("class", "title")


             //mouseover event handler function
                 function onMouseOver(d,i) {
                   d3.select("#tooltip")
                  .style("left", d3.event.pageX + "px")
                  .style("top", d3.event.pageY + "px")
                  .style("opacity", 1)
                  .select("#value")
                      .text(function() {
                        if(d.sentiment){
                           return "count: " +d.count +"\n" + d.sentiment + "Sentiment";  // Value of the text
                        }

                      })
                      .attr("fill",function(){
                        if(d.sentiment =="Positive"){
                          return "Green"
                        }
                        else if(d.sentiment =="Negative"){
                          return "Red";
                        }
                        else if(d.sentiment =="Neutral"){
                          return "Yellow";
                        }
                        else{
                          return ;;
                        }
                      });
                 }

                 //mouseout event handler function
                 function onMouseOut(d, i) {
                   d3.select("#tooltip")
          .style("opacity", 0);;
                 }



});

d3.select("body").append("footer").attr("class","jumbotron container")
.html("<small> &copy;MAT 2017, Data Science Mini project, Helsinki University, by The Trump Classifiers Group. 'I tweet once or twice in a day, without twitter life would have been a desastrious place to live.', Donald J. Trump <small>")

}
