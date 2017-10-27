function worldMap(){
  d3.select("#map").remove();
  d3.select("#map").select("svg").remove();
  d3.select("#us-map").remove();
  d3.select("#us-map").select("svg").remove();
  d3.select("#bar-graph").remove();
  d3.select("#pie-graph").remove();
  d3.select("body").select("footer").remove();
var margin = {
    top:100,
    left:20,
    right:50,
    bottom:10
};
var width = 900- margin.left - margin.right;
var height =450- margin.top - margin.bottom;
var body = d3.select("body");
var mapDiv =body.append("div").attr("id","map")

var svg = mapDiv.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height",height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate("+margin.left + ","+margin.top+")");

d3.queue()
  .defer(d3.json, "world-countries.json")
  .defer(d3.csv,"capitals.csv")
  .defer(d3.csv,"coordinates.csv")
  .await(ready);
var projection = d3.geoMercator()
                  .translate([width/2,height/2])
                  .scale(130);

var path = d3.geoPath()
             .projection(projection);

function ready(error, data,capitals,coordinates){

  var positive = 0
  var negative = 0;
  var neutral = 0;
  var totalSentiment = []
  for(var i = 0; i < coordinates.length;i++){
    var sentiment = coordinates[i].sentiment;
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
totalSentiment[0] = positive
totalSentiment[1] = negative
totalSentiment[2] = neutral
// console.log(totalSentiment)


var countries = topojson.feature(data, data.objects.countries1).features;

svg.selectAll(".country")
.data(countries)
.enter().append("path")
.attr("class","country")
.attr("d",path)
.attr("fill",function(d){ return "red";})
.on("mouseover",function(d){
    d3.select(this).classed("selected",true);

})
.on("mouseout",function(d){
    d3.select(this).classed("selected",false);
})

svg.selectAll(".city-circle")
    .data(capitals)
    .enter()
    .append("circle")
    .attr("r",2.5)
    .attr("class","city-circle")
    .attr("cx",function(d){
            var coords = projection([d.long,d.lat])
            return coords[0]

    })
    .attr("cy",function(d){
            var coords = projection([d.long,d.lat])
            return coords[1]
    })
    .attr("fill","white")

svg.selectAll('.city-label')
    .data(capitals)
    .enter()
    .append("text")
    .attr("x",function(d){
            var coords = projection([d.long,d.lat])
            return coords[0];

    })
    .attr("y",function(d){
            var coords = projection([d.long,d.lat])
            return coords[1];

    })
    .attr("dx",5)
    .attr("dy",5)
    .attr("class","city-label")
    .text(function(d){
            return d.name;
    })

    svg.selectAll(".tweet-circle")
      .data(coordinates)
      .enter()
      .append("circle")
      .attr("class","tweet-circle")
      .attr("r",3)
      .attr("cx",function(d,i){
        if(d.coordinates!=""){
          var arr = d.coordinates;
          try{
              var arr = JSON.parse(arr);
              var coords =arr[0][0];
          }
          catch(err) {
            return true;
          }

        var coords = projection(coords);
        return coords[0];

        }

      })
      .attr("cy",function(d){
        if(d.coordinates!=""){
          var arr = d.coordinates;
          try{
              var arr = JSON.parse(arr);
              var coords =arr[0][0]
          }
          catch(err) {
            return true;
          }
        var coords = projection(coords);
        return coords[1];

        }
      })
      .attr("opacity",0.6)
      .attr("fill",function(d){
      if(d["sentiment"] ==="positive"){
      return "green";

      }
      else if(d["sentiment"] ==="negative"){
      return "red";

      }
      else if(d["sentiment"] ==="neutral")
      return "yellow";

      })

}
d3.select("body").append("footer").attr("class","jumbotron container")
.html("<small>&copy;MAT 2017, Data Science Mini project, Helsinki University, by The Trump Classifiers Group. 'I tweet once or twice in a day, without twitter life would have been a desastrious place to live.', Donald J. Trump <small>")

};
