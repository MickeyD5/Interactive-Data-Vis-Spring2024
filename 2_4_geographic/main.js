/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
height = window.innerHeight * 0.7,
margin = { top: 20, bottom: 50, left: 60, right: 40 };

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
 Promise.all([
  d3.json("../data/world.json"),
  d3.csv("../data/MoMA_nationalities.csv", d3.autoType),
]).then(([geojson, nationalities]) => {

  console.log(geojson)
  console.log(nationalities)
  //console.log(d => nationalities.Count)
  
  const svg = d3.select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  const colorScale = d3.scaleThreshold()
  .domain([0, 1, 10, 100, 1000, 5000])
  .range(d3.schemeBlues[6]);

  // SPECIFY PROJECTION
  const projection = d3.geoMercator()
  .fitSize([
      //width-margin.left-margin.right,
      //height-margin.top-margin.bottom

      width,height

  ], geojson);

  // DEFINE PATH FUNCTION
const path = d3.geoPath(projection)

  // APPEND GEOJSON PATH  
  //const country = 
  svg.selectAll(".property")
      .data(geojson.features)
      .join("path")
      .attr("class", "country")
      .attr("stroke", "black")
      //.attr("fill",d=> colorScale(d.nationalities))
      //.attr("d", path)
      .attr("fill", d=>{
          const country = d.properties.name;
          const nationality = nationalities.find(n => n.Country === country);
          return nationality ? colorScale(nationality.Count) : "transparent";})
        .attr("d", d => path(d));


  //Legend Attempt-> can't get artist title to show over legend
  const g = svg.append("svg")
    
    .attr("class", "legendThreshold")
    .attr("transform", "translate(190,500)");
    g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .style("font-size","12px")
    .text("Artist Count");

const labels = ['0', '1-10','10-100', '100-1000','1000-5000', '> 5000'];

const legend = d3.legendColor()
    .labels(d=> { return labels[d.i]; })
    .shapePadding(0)
    //.shapeWidth(40)
    .scale(colorScale);

    svg.select(".legendThreshold")
    .call(legend); 

    


});