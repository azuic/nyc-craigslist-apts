var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");
var w = 100,
  h = 100;
// var resize
// http://data.beta.nyc//dataset/0ff93d2d-90ba-457c-9f7e-39e47bf2ac5f/resource/35dd04fb-81b3-479b-a074-a27a37888ce7/download/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson
d3.json("data/nyc.json", function (error, nyc) {
  if (error) throw error;

  var path = d3.geoPath()
    .projection(d3.geoConicConformal()
      .parallels([33, 45])
      .rotate([96 - 29, -39])
      .fitSize([width * 0.9, height * 0.9], nyc));

  svg.selectAll("path")
    .data(nyc.features)
    .enter().append("path")
    .attr("d", path)
    // .style("fill","#002c")
    .on("mouseenter", function (d) {
      d3.select(this)
        .style("stroke-width", .25)
        .style("stroke-dasharray", 0)
        .style("fill", "#ff4a00")
      d3.select("#neighborhoodPopover")
        .transition()
        .style("opacity", 1)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px")
        .text(d.properties.neighborhood)
    })
    .on("mouseleave", function (d) {
      d3.select(this)
        .style("stroke-width", .25)
        .style("stroke-dasharray", 1)
        .style("fill", "#002c74")
      d3.select("#cneighborhoodPopoverountyText")
        .transition()
        .style("opacity", 0);
    })

    .on("click", function (d) {
      d3.select(this)
        .style("stroke-width", .25)
        .style("stroke-dasharray", 0)
        .style("fill", "#ff4a00")

      d3.select('#cloud').selectAll('*').remove();
      var result = neighborsdata.find(each => each.neighborhood === d.properties.neighborhood);
      let list = (result != undefined) ? result.freqlist : [{ "text": "No", "size": 25 }, { "text": "Post", "size": 25 }, { "text": "Or", "size": 25 }, { "text": "Photo", "size": 25 }];
      list = list.slice().sort((a, b) => d3.descending(a.size, b.size))
      let fontsizes = list.map(d=>Math.sqrt(d.size)*15)
      let cumsums = d3.cumsum(fontsizes)
      list = list.map((d,i)=>({...d,x:0,fontSize:fontsizes[i],heightAbove:i===0?0:cumsums[i-1]}))
      console.log(list)
      d3.select("#cloud")
        .append("g")
        .attr("class","list-word-cloud")
        .append("text")
        .attr("x",0)
        .attr("y",0)
        .selectAll("tspan")
        .data(list)
        .enter()
        .append("tspan")
        .style("font-size", d=>`${d.fontSize}px`)
        // .attr("x",0)
        // .attr("dy",'2em')
        .attr("dy",d=>`${d.heightAbove}px`)
        // .style("text-anchor", "start")
        .text(d=>`${d.text}/    `)
        
        
        .on("mouseenter", (d) =>{
          d3.select(this)
          d3.select("#neighborhoodPopover")
            .transition()
            .style("opacity", 1)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px")
            .style("font-family", "Thasadith, sans-serif")
            .attr("transform","rotate(0)")
            .text(d.text + ": " + d.size)
        })
        .on("mouseleave", (d)=>{
          d3.select(this)
          d3.select("#cneighborhoodPopoverountyText")
            .transition()
            .style("opacity", 0);
        })
    });
});
