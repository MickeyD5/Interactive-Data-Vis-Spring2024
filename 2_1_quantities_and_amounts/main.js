
/* CONSTANTS AND GLOBALS */
/*const width = window.innerWidth *.8;
const height = 500;
margin = 40; */

/* Test to make graph smaller */
const margin = {top: 20, right: 30, bottom: 40, left: 90},
width = 460 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom; 


/* LOAD DATA */
d3.csv('../data/MoMA_topTenNationalities.csv', d3.autoType)
  .then(data => {
  console.log("data", data)

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const svg = d3.select("#container")
  .append("svg")
  //.attr("width", width)
  //.attr("height", height)

  /* Test to make graph smaller */
  .attr("width", width + margin.left + margin.right)
  .attr("height",height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", 
  "translate(" + margin.left + "," + margin.top + ")");

    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    const xScale= d3.scaleLinear()
          .domain([0, d3.max(data, (d=> d.Count))])
          .range([0, width]);
    svg.append("g")
          .attr("transform","translate(0," + height + ")")
          .call(d3.axisBottom(xScale))
          .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor","end");

    
    const yScale=d3.scaleBand()
          .domain(data.map(d=> d.Nationality))
          .range([0, height])
          .padding(.2);
    svg.append("g")
        .call(d3.axisLeft(yScale))
        


    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */

    svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width", d=> xScale(d.Count))
    .attr("height", yScale.bandwidth())
    .attr("x",xScale(0) )
    .attr("y", d=> yScale(d.Nationality))
    .attr("fill", d=> colorScale(d.Nationality))
    ;

  })