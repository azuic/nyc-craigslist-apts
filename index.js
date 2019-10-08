var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
var w = 100,
    h = 100;
var color = d3.scaleLinear()
    .domain([0,1,2,3,4,5,6,10,15,20,100])
    .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

// var resize
// http://data.beta.nyc//dataset/0ff93d2d-90ba-457c-9f7e-39e47bf2ac5f/resource/35dd04fb-81b3-479b-a074-a27a37888ce7/download/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson
d3.json("data/nyc.json", function(error, nyc) {
  if (error) throw error;

  var path = d3.geoPath()
      .projection(d3.geoConicConformal()
      .parallels([33, 45])
      .rotate([96-29, -39])
      .fitSize([width*0.9, height*0.9], nyc));

  svg.selectAll("path")
      .data(nyc.features)
      .enter().append("path")
      .attr("d", path)
      // .style("fill","#002c")
      .on("mouseenter", function(d) {
        d3.select(this)
        .style("stroke-width", .25)
        .style("stroke-dasharray", 0)
        .style("fill","#ff4a00")
        d3.select("#neighborhoodPopover")
        .transition()
        .style("opacity", 1)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px")
        .text(d.properties.neighborhood)
    })
    .on("mouseleave", function(d) {
      d3.select(this)
      .style("stroke-width", .25)
      .style("stroke-dasharray", 1)
      .style("fill","#002c74")
      d3.select("#cneighborhoodPopoverountyText")
      .transition()
      .style("opacity", 0);
    })
    .on("click", function(d){
      d3.select(this)
      .style("stroke-width", .25)
      .style("stroke-dasharray", 0)
      .style("fill","#ff4a00")
      d3.select('#cloud').selectAll('*').remove();
        var result = neighborsdata.find(each => each.neighborhood === d.properties.neighborhood);
        var maxcount=1;
        var list = [{"text":"No","size":25},{"text":"Post","size":25},{"text":"Or","size":25},{"text":"Photo","size":25}];
        if (result != undefined) list = result.freqlist;
        d3.layout.cloud().size([600, 800])
         .words(list)
         .rotate(0)
         .fontSize(function(d) {return d.size; })
         .on("end", draw)
         .start();

        });
        function draw(words) {
          d3.select("#cloud")
            .attr("width", 650)
            .attr("height", 850)
            .attr("class", "wordcloud")
            .attr("gridSize",4)
            .append("g")
            // without the transform, words words would get cutoff to the left and top, they would
            // appear outside of the SVG area
            .attr("transform", "translate(320,200)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("fill", function(d, i) { return color(i); })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; })
            .on("mouseenter", function(d) {
              d3.select(this)
              d3.select("#neighborhoodPopover")
              .transition()
              .style("opacity", 1)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + "px")
              .style("font-family", "Thasadith, sans-serif")
              .text(d.text+" "+d.size)
          })
          .on("mouseleave", function(d) {
            d3.select(this)
            d3.select("#cneighborhoodPopoverountyText")
            .transition()
            .style("opacity", 0);
          })
        }

      // console.log(img.src)


    // });
});
