function usMap(){
  d3.select("#map").remove();
  d3.select("#map").select("svg").remove();
  d3.select("#us-map").remove();
  d3.select("#us-map").select("svg").remove();
  d3.select("#bar-graph").remove();
  d3.select("#pie-graph").remove();
  d3.select("body").select("footer").remove();
var margin = {
    top:20,
    left:50,
    right:50,
    bottom:50
};

var width = 900- margin.left - margin.right;
var height = 450- margin.top - margin.bottom;

var body = d3.select("body");
var usMap = body.append("div").attr("id","us-map")

var svg = usMap.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height",height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate("+margin.left + ","+margin.top+")");

usaJSON = "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json"

d3.queue()
.defer(d3.json, usaJSON)
.defer(d3.csv, "coordinates.csv")
.await(ready);

// var projection = d3.geo.albersUsa()
// var projection = d3.geo.mercator()
// var projection = d3.geoAlbersUsa()
var projection = d3.geoAlbers()
                  .translate([width/2,height/2])
                  .scale([900]);
var path = d3.geoPath()
             .projection(projection);
function ready(error, data,coordinates){
  var states = topojson.feature(data,data.objects.states).features;
  console.log(states);
    var positive = 0
    var negative = 0;
    var neutral = 0;
    var totalSentiment = [];
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
  svg.selectAll(".state")
      .data(states)
      .enter()
      .append("path")
      .attr("class","state")
      .attr("d",path)
      .attr("fill",function(d) {
        return "#d6f5d6";

      })
      .on("mouseover",function(d){
          d3.select(this).classed("selected",true)
      })
      .on("mouseout",function(d){
          d3.select(this).classed("selected",false)
      })
  //
  //         svg.selectAll('.state-label')
  //             .data(states)
  //             .enter()
  //             .append("text")
  //             .attr("x",function(d){
  //                     var coords = projection([d.long,d.lat])
  //                     return coords[0];
  //
  //             })
  //             .attr("y",function(d){
  //                     var coords = projection([d.long,d.lat])
  //                     return coords[1];
  //
  //             })
  //             .attr("dx",5)
  //             .attr("dy",5)
  //             .attr("class","state-label")
  //             .text(function(d){
  //               console.log("waht is d",d)
  //                     return d.name;
  //             })
  //
  //
  //
  //             var legend = d3.select("body").append("div").attr("id","info").selectAll(".legend");
  //             legend.data(totalSentiment)
  //             .enter()
  //             .append("div")
  //             .style("width","100px")
  //             .style("height","30px")
  //             .style("margin-bottom","2px")
  //             .attr("class","legend")
  //             .style("background",function(d,i){
  //                       if(i ==0){
  //                       return "green";
  //                       }
  //                       else if(i==1){
  //                       return "yellow";
  //
  //                       }
  //                       else if(i==2){
  //                       return "red";
  //                       }
  //                       else{
  //                       return ;;
  //                       }
  //
  //             })
  //
  //             var text = legend.selectAll(".legend")
  //                               .data(totalSentiment)
  //                               .enter()
  //                               .append("text")
  //                               .attr("x","120px")
  //                               .attr("y","30px")
  //                               .text(function(d,i){ return d;});
  //
  //
  //
  //
  //
  // var colors =["#1b8a5a","#fbb021","#ee3e32"]
  //
  var count = 0;
  svg.selectAll(".tweet-circle")
  .data(coordinates)
  .enter()
  .append("circle")
  .attr("class","tweet-circle")
  .attr("r",5)
  .attr("cx",function(d,i){
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
  .attr("opacity",0.75)
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
   .html("<small> &copy;MAT 2017, Data Science Mini project, Helsinki University, by The Trump Classifiers Group. 'I tweet once or twice in a day, without twitter life would have been a desastrious place to live.', Donald J. Trump <small>")
};
