function barGraph(){
  d3.select("#map").remove();
  d3.select("#map").select("svg").remove();
  d3.select("#us-map").remove();
  d3.select("#us-map").select("svg").remove();
  d3.select("#bar-graph").remove();
  d3.select("#pie-graph").remove();
  d3.select("body").select("footer").remove();

var width = 600;
var height = 500;

var svg = d3.select("body").append("svg").attr("id","bar-graph")
.attr("width",width)
.attr("height",height);

var margin = 200,
    width = width - margin,
    height = height - margin;

        var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);

        var g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");

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
percentPositive = positive/sum * 100;
percentNegative = negative/sum * 100;
percentNeutral = neutral/sum * 100;

totalSentiment[0] = {"sentiment":"Positive","count":positive};
totalSentiment[1] = {"sentiment":"Negative","count": negative};
totalSentiment[2] = {"sentiment":"Neutral", "count": neutral}

xScale.domain(totalSentiment.map(function(d,i) {
  return d.sentiment; }));
yScale.domain([0,d3.max(totalSentiment,function(d){
  return d.count
})])

g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale));
         g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale))
         .append("text")
         .attr("y", height - 250)
         .attr("x", width - 100)
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Sentiment");

       g.append("g")
                .call(d3.axisLeft(yScale).tickFormat(function(d){
                    return d;
                }).ticks(10))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "-5.1em")
                .attr("text-anchor", "end")
                .attr("stroke", "black")
                .text("Count");

  g.selectAll(".bar")
           .data(totalSentiment)
           .enter().append("rect")
           .attr("class", "bar")
           .attr("x", function(d) { return xScale(d.sentiment); })
           .attr("y", function(d) { return yScale(d.count); })
           .on("mouseover", onMouseOver) //Add listener for the mouseover event
           .on("mouseout", onMouseOut)   //Add listener for the mouseout event
           .attr("width", xScale.bandwidth())
           .transition()
           .ease(d3.easeLinear)
           .duration(400)
           .delay(function (d, i) {
               return i * 50;
           })
           .attr("height", function(d) { return height - yScale(d.count); })
           .attr("fill",function(d){
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
           })
           .attr("opacity",0.65)

    svg.append("text")
   .attr("transform", "translate(100,0)")
   .attr("x", 50)
   .attr("y", 50)
   .attr("font-size", "16px")
   .text("Public Sentiments about Donald J. Trump")

});

//mouseover event handler function
    function onMouseOver(d,i) {
        d3.select(this).attr('class', 'highlight');
        d3.select(this)
          .transition()     // adds animation
          .duration(400)
          .attr('width', xScale.bandwidth() + 5)
          .attr("y", function(d) { return yScale(d.count) - 10; })
          .attr("height", function(d) { return height - yScale(d.count) + 10; });
        g.append("text")
         .attr('class', 'val')
         .attr('x', function() {
             return xScale(d.sentiment);
         })
         .attr('y', function() {
             return yScale(d.count) - 20;
         })
         .text(function() {
           if(d.sentiment){
              return "count: " +d.count +"\n" + d.sentiment + " Sentiment";  // Value of the text
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
        // use the text label class to remove label on mouseout
        d3.select(this).attr('class', 'bar');
        d3.select(this)
          .transition()     // adds animation
          .duration(400)
          .attr('width', xScale.bandwidth())
          .attr("y", function(d) { return yScale(d.count); })
          .attr("height", function(d) { return height - yScale(d.count); });

        d3.selectAll('.val')
          .remove()
    }

d3.select("body").append("footer").attr("class","jumbotron container")
.html("<small> &copy;MAT 2017, Data Science Mini project, Helsinki University, by The Trump Classifiers Group. 'I tweet once or twice in a day, without twitter life would have been a desastrious place to live.', Donald J. Trump <small>")
}
