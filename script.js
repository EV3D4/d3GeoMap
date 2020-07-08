var width = $(".divCard").width();
var height = $(".divCard").height();

var projection = d3.geo.mercator()
  .center([0 ,0])
  .scale(250)
  .rotate([0, 0]);



  projection.translate([width/2, height/2]);



var svg = d3.select(".divCard").append("svg")
  .attr("width", width)
  .attr("height", height);

var path = d3.geo.path()
  .projection(projection);

  

var g = svg.append("g");

var g = svg.append("g");
var aa = projection([-122.490402, 37.786453]),
  bb = projection([-122.389809, 37.72728]);


var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// load and display the World
d3.json("https://gist.githubusercontent.com/d3noob/5193723/raw/6e1434b2c2de24aedde9bcfe35f6a267bd2c04f5/world-110m2.json", function(error, topology) {



  d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json", function(error, meteorites) {



    var metoritesData = meteorites.features.map(function(d, i) {
      return [

        meteorites.features[i].properties.reclong,
        meteorites.features[i].properties.reclat,
        parseFloat(meteorites.features[i].properties.mass),
        meteorites.features[i].properties.name,
        meteorites.features[i].properties.year,
        meteorites.features[i].properties.recclass
      ]
    });



    console.log(JSON.stringify(metoritesData[3][3]))
    g.selectAll("path")
      .data(topojson.object(topology, topology.objects.countries)
        .geometries)
      .enter()
      .append("path")
      .attr("d", path)
    g.selectAll("circle")
      .data(metoritesData).enter()
      .append("circle")
      .attr("cy", function(d) {
        return projection(d)[1];
      })
      .attr("cx", function(d) {
        return projection(d)[0];
      })
      .attr("r", function(d) {
        if (d[2] > 1000000) return d[2] / 1000000
        else return (d)[2] / 10000
      })
      .attr("fill", "blue")
      .on("mouseover", function(d) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            "name: " + d[3] + "<br> mass: " + d[2] + "<br> year: " + d[4] + "<br> class: " + d[5] + "<br> lat: " + d[1] + ", long: " + d[0]
          )
          .style("left", d3.event.pageX + 5 + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function(d) {
        tooltip.transition().duration(500).style("opacity", 0);
      });



  });
});





// zoom and pan
var zoom = d3.behavior.zoom()
  .on("zoom", function() {
    g.attr("transform", "translate(" +
      d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
    g.selectAll("path")
      .attr("d", path.projection(projection));
  });

svg.call(zoom)
