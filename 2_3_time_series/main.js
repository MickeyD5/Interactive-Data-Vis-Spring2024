 /* CONSTANTS AND GLOBALS */
 const width = window.innerWidth * 0.7,
 height = window.innerHeight * 0.7,
 margin = {top:20, bottom:50,left:60,right:60};



//const formatDate = d3.timeFormat("%Y")

//LOAD DATA - not working for some reason
d3.csv("../data/Average_holiday_Spending_by_Americans.csv", d => {
  return {
    Year: new Date(+d.Year, 0, 1),
    Spent: +d["Gifts for Family"]
  }
}).then(data => {
  console.log('data :>> ', data); 

/*Load Data
  d3.csv("../data/Average_holiday_Spending_by_Americans.csv", d3.autotype)
   .then(data => {
    console.log('data :>> ', data); */

  // Scales

  const xScale= d3.scaleTime()
          .domain(d3.extent(data, d=> d.Year))
          .range([margin.right, width-margin.left]);

          console.log(xScale.domain())
  
    const yScale=d3.scaleLinear()
          .domain(d3.extent(data, d=> d.Spent))
          .range([height-margin.bottom,margin.top])


   //SVG 
   const svg = d3.select("#container")
   .append("svg")
   .attr("width", width)
   .attr("height", height)

//Axis

const xAxis= d3.axisBottom(xScale)
              //.tickformat(d3.timeFormat("%Y"));
svg.append("g")
.attr("transform", `translate(0, ${height-margin.bottom})`)
.call(xAxis)

const yAxis = d3.axisLeft(yScale)
svg.append("g")
.attr("transform", `translate(${margin.left},0)`)
.call(yAxis) 


   const lineGen = d3.line()
                    .x(d=> xScale(d.Year))
                    .y(d => yScale(d.Spent));
    
    const areaGen = d3.area()
                .x(d=> xScale(d.Year))
                .y0(height-margin.bottom)
                .y1(d => yScale(d.Spent));

  //Draw Line
    svg.append("path")
    .data([data])
    .attr("fill", "none")
    .attr("stroke", "#2e853a")
    .attr("d", lineGen);

   

    //Draw Area
    svg.append("path")
    .data([data])
    .attr("fill", "#faf20c")
    .attr("opacity", "0.5")
    .attr("d", areaGen); 


    //Y Label

    svg.append("text")
      .attr("x", -height/2)
      .attr("y", margin.left/3)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Average Spent")
      .style("font-size", "16px")
      .style("fill", "black") 
    
      //X Label
      svg.append("text")
      .attr("x", width/2)
      .attr("y", height-margin.bottom/3)
      .attr("text-anchor", "middle")
      .text("Year")
      .style("font-size", "16px")
      .style("fill", "black") 
    
});