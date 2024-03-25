/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
height = window.innerHeight * 0.7,
margin = {top:20, bottom:60,left:60,right:40},
radius =5 ;


/*const margin = {top: 20, right: 30, bottom: 40, left: 50},
width = 520 - margin.left - margin.right,
height = 520 - margin.top - margin.bottom; */

/* LOAD DATA */
d3.csv("../data/MoMA_distributions.csv", d3.autoType)
  .then(data => {
    console.log(data)

    /* SCALES */

    //xScale
    const xScale = d3.scaleLinear()
            .domain([0, d3.max(data.map(d=> d["Width (cm)"]))])
            .range([margin.left, width-margin.right]);

    //yScale
    const yScale = d3.scaleLinear()
    .domain([0,d3.max(data, d=> d["Length (cm)"])])
    .range([height - margin.bottom, margin.top]);

    //Filtered Data to exclude age 0 and greater than 100
const filteredData = data.filter(d => 
{return d["Artist Lifespan"] > 0 && d["Artist Lifespan"] <= 100;})

    //SizeScale
    const CircleSize= d3.scaleSqrt()
      .domain([0, d3.max(filteredData, d=> d["Artist Lifespan"])])
      .range([2,9]);

    //Color Range
    const color = d3.scaleOrdinal()
    .domain(["(Male)", "(Female)"])
    .range(["#619CFF", "#F8766D"])
    
    
    
    /* HTML ELEMENTS */


    const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    
    

    /* Test
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height",height + margin.top + margin.bottom)
  .append("g")
      .attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")"); */

    

    /*Graph background color- Test
     svg
    .append("rect")
    .attr("xScale",0)
    .attr("yScale",0)
    .attr("width", height)
    .attr("height", height)
    .style("fill", "EBEBEB") */

    //Axis Scales
    const xAxis= d3.axisBottom(xScale)
svg.append("g")
.attr("transform", `translate(0, ${height-margin.bottom})`)
.call(xAxis)

const yAxis = d3.axisLeft(yScale)
svg.append("g")
.attr("transform", `translate(${margin.left},0)`)
.call(yAxis) 


//Tooltip

const tooltip = d3.select("#container")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("position", "absolute")

  //Tooltip functions

  const mouseover = d=>{
    tooltip.style("opacity", 1)
  }

  const mousemove = (event,d)=> {
    tooltip
    .html("Artist: " + d.Artist + "</br>" +
          "Age: " + d["Artist Lifespan"] + "</br>" +
          "Length(cm): " + d["Length (cm)"]+ "</br>" +
          "Width(cm): "  +  d["Width (cm)"]+ "</br>" +
          "Nationality: "+ d.Nationality
    )
      .style("left", (event.layerX) + "px")
      .style("top", (event.layerY) + "px")
  }

const mouseleave = d=> {
  tooltip
    .transition()
    .duration(200)
    .style("opacity", 0)
}
    //Draw Circles

    svg.selectAll(".circle")
    .data(filteredData)
    .join("circle")
    //.attr("class", "circle")
    .attr("r", d=> CircleSize(d["Artist Lifespan"]))
    .attr("cx", d=> xScale(d["Width (cm)"]))
    .attr("cy", d=> yScale(d["Length (cm)"]))
    .attr("fill", d=> color(d.Gender))
    .attr("opacity",0.5)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    //Y Label

    svg.append("text")
      .attr("x", -height/2)
      .attr("y", margin.left/3)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Length (cm)")
      .style("font-size", "16px")
      .style("fill", "black")
    
      //X Label
      svg.append("text")
      .attr("x", width/2)
      .attr("y", height-margin.bottom/3)
      .attr("text-anchor", "middle")
      .text("Width (cm)")
      .style("font-size", "16px")
      .style("fill", "black")

      
  });