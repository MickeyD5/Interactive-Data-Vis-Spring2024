
/* CONSTANTS AND GLOBALS */
const width = window.innerWidth *.8;
const height = 600;
const wmargin= 80;
const hmargin =40;
 


// LOAD DATA 
Promise.all([
  d3.csv('../data/Artworks_Acquisitions.csv', d => ({
      //return {
        Year: new Date(+d.Year, 0, 1),
        Total_Acquisitions: +d.Count
      }
            
  )), 
  d3.csv("../data/Acquisitions_Gender.csv", d3.autoType),
  //d3.csv("../data/Artworks_Classification.csv", d3.autoType),
  d3.csv("../data/Acquisitions_Classifications.csv", d3.autoType),


])
.then(([
	acquisitions, 
	gender,
  type]) =>{
  console.log(acquisitions)
  console.log(gender)
  console.log(type)




  const xScale = d3.scaleTime()
  .domain(d3.extent(acquisitions, d=> d.Year))
  .range([wmargin, width - wmargin])
  //.range([margin.right, width-margin.left]);

  console.log(xScale.domain())

// Add Y axis
const yScale = d3.scaleLinear()
  .domain([0,d3.max(acquisitions,( d=> d.Total_Acquisitions))])
  .range([height - hmargin, hmargin])
  //.range([ height-margin.bottom, margin.top ])




// append the svg object to the body of the page
const svg = d3.select("#container1")
  .append("svg")
  .attr("width", width)
  .attr("height", height) 


//Axis
const xAxis= d3.axisBottom(xScale)
svg.append("g")
.attr("transform", `translate(0, ${height-hmargin})`)
.call(xAxis)

const yAxis = d3.axisLeft(yScale)
svg.append("g")
.attr("transform", `translate(${wmargin},0)`)
.call(yAxis) 


const lineGen = d3.line()
                .x(d=> xScale(d.Year))
                .y(d => yScale(d.Total_Acquisitions));

// Set the gradient
svg.append("linearGradient")
  .attr("id", "line-gradient")
  .attr("gradientUnits", "userSpaceOnUse")
  .attr("x1", 0)
  .attr("y1", height)
  .attr("x2", 0)
  .attr("y2", 0)
  .selectAll("stop")
    .data([
      {offset: "0%", color: "blue"},
      {offset: "100%", color: "red"}
    ])
  .enter().append("stop")
    .attr("offset", d=> { return d.offset; })
    .attr("stop-color", d=> { return d.color; });


// Add the line
svg.append("path")
  .datum(acquisitions)
  .attr("fill", "none")
  .attr("stroke", "url(#line-gradient)" )
  .attr("stroke-width", 2)
  .attr("d", lineGen);

  /* Tried to set a background behind text but didn't get it to work
  svg.append("g")
  .selectAll("rect")
  .data(acquisitions)
  .enter()
  .append("text")
  //.style("fill", "#000")
    .attr("class", "label")
    .attr("x", d => xScale(d.Year)) 
    .attr("y", d => yScale(d.Total_Acquisitions) )
    .style("fill", "black")
    .style("opacity", "0.5") ;

*/

  //Point Labels
  svg.selectAll(".Linelabel")
  .data(acquisitions)
  .enter()
  .append("text")
  //.style("fill", "#000")
    .attr("class", "label")
    .attr("x", d => xScale(d.Year)) 
    .attr("y", d => yScale(d.Total_Acquisitions) )
    //.style("fill", "black")
    //.style("opacity", "0.5") 
    .text(d => d.Total_Acquisitions);

   

   //Y Label

   svg.append("text")
   .attr("x", -height/2)
   .attr("y", wmargin/3)
   .attr("transform", "rotate(-90)")
   .attr("text-anchor", "middle")
   .text("Total Acquisitions")
   .style("font-size", "16px")
   .style("fill", "black") 
 
   //X Label
   svg.append("text")
   .attr("x", width/2)
   .attr("y", height-hmargin/30)
   .attr("text-anchor", "middle")
   .text("Year")
   .style("font-size", "16px")
   .style("fill", "black") 
 

//CONTAINER2
      
//ColorSccale
//const myColor = d3.scaleOrdinal(d3.schemeCategory10);
const myColor = d3.scaleOrdinal()
.domain(["Male Count", "Female Count"])
.range(["#619CFF", "#F8766D"])

    //Add X axis 
    const xScaleBar = d3.scaleBand()
      .domain(gender.map(d=> d.Year))
      .range([wmargin, width - wmargin]);

      console.log(xScale.domain())

    // Add Y axis
    const yScaleBar = d3.scaleLinear()
      .domain([0,d3.max(gender, d=> d["Male Count"])])
      .range([ height - hmargin, hmargin])
    

// append the svg object to the body of the page
const svgBar = d3.select("#container2")
      .append("svg")
      .attr("width", width)
      .attr("height", height) 


//Axis
const xAxisBar= d3.axisBottom(xScaleBar)
svgBar.append("g")
.attr("transform", `translate(0, ${height-hmargin})`)
.call(xAxisBar)

const yAxisBar = d3.axisLeft(yScaleBar)
svgBar.append("g")
.attr("transform", `translate(${wmargin},0)`)
.call(yAxisBar)    

svgBar.selectAll("rect")
    .data(gender)
    .join("rect")
    .attr("width", xScaleBar.bandwidth())
    .attr("height",d=> height-yScaleBar(d["Male Count"])-hmargin )
    .attr("x",d=> xScaleBar(d.Year) )
    .attr("y", d=> yScaleBar(d["Male Count"]))
    //.attr("fill", d=> myColor(d["Male Count"]))
    .attr("fill","#619CFF" )
    ;


    svgBar.selectAll(".label")
    .data(gender)
    .enter()
    .append("text")
      .attr("class", "label")
      .attr("x", d => xScaleBar(d.Year) + xScaleBar.bandwidth()/2) 
      .attr("y", d => yScaleBar(d["Male Count"]) ) 
      .text(d => d["Male Count"]);


//Bar Dropdown

document.getElementById('gender-select').addEventListener('change', function(){
const selectedGender = this.value;
updateBar(selectedGender)

});


function updateBar(selectedGender){
  svgBar.selectAll("rect")
    .data(gender)
    .join("rect")
    .attr("width", xScaleBar.bandwidth())
    .attr("height",d=> height-yScaleBar(d[selectedGender])-hmargin )
    .attr("x",d=> xScaleBar(d.Year) )
    .attr("y", d=> yScaleBar(d[selectedGender]))
    .attr("fill", d=> myColor(selectedGender))
    //.attr("fill", "#F8766D")
    ;
    
  svgBar.selectAll(".label")
    .data(gender)
    .join("text")
      .attr("class", "label")
      .attr("x", d => xScaleBar(d.Year) + xScaleBar.bandwidth()/2) 
      .attr("y", d => yScaleBar(d[selectedGender]) ) 
      .text(d => d[selectedGender]);

}


//CONTAINER3-data includes classifications with a count over 20 in 2015

      //CHANGE SIZE OF SVG
      const width2 =600;
      const margin = 30;

      //Create the color scale
      const colorScale = d3.scaleOrdinal()
      .domain(type.map(d => d.Classification))
      .range(d3.schemePaired);

      const svg3 = d3.select("#container3")
      .append("svg")
      .attr("width", width)
      .attr("height", height) 

/* Original code that uses artworks_classification csv
      // Create the pack layout
      const pack = d3.pack()
      .size([width2-margin, height-margin])
      .padding(2);

      // Create the hierarchy from the data
      const root = d3.hierarchy({children: type})
      .sum(d => d.Count);

      // Compute the pack layout
      const nodes = pack(root).leaves();

      const bubbles = svg3.selectAll(".bubble")
      .data(nodes)
      .enter()
      .append("circle")
        .classed("bubble", true)
        .attr("r", d=> { return d.r; })
        .attr("cx", d=> { return d.x; })
        .attr("cy", d=> { return d.y; })
        .style("fill", d=> { 
          //console.log(d)
          return colorScale(d.data.Classification); });
          */
        
    // Create the pack layout
    const pack = d3.pack()
    .size([width2-margin, height-margin])
    .padding(2);

    // Create the hierarchy from the data
    const root = d3.hierarchy({children: type.filter(d=> {return d.Year === 2015})})

    .sum(d => d.Count);

    // Compute the pack layout
    const nodes = pack(root).leaves();
    
    

    const bubbles = svg3.selectAll(".bubble")
    .data(nodes)
    .enter()
    .append("circle")
      .classed("bubble", true)
      .attr("r", d=> { return d.r; })
      .attr("cx", d=> { return d.x; })
      .attr("cy", d=> { return d.y; })
      .style("fill", d=> { 
        //console.log(d)
        return colorScale(d.data.Classification); 
      });
console.log(nodes)

      //create the text label
      const labels = svg3.selectAll(".label")
      .data(nodes)
      .enter()
      .append("text")
        .classed("label", true)
        .attr("x", d=>{ return d.x; })
        .attr("y", d=> { return d.y; })
        .text(d => d.data.Count.toLocaleString());

      //Create Legend
        const legend = d3.legendColor()
          .shapePadding(5)
          //.shapeWidth(40)
          .scale(colorScale)
          .title("Classification")
          .labelOffset(39);

          svg3.append("g")
          .attr("transform", "translate(580,100)")
          .call(legend); 

//Bubble Dropdown

document.getElementById('year-select').addEventListener('change', function(){
  const selectedYear = this.value;
  console.log(selectedYear)
  updateBubble(selectedYear)
  
  });
  
  
  function updateBubble(selectedYear){

    const root = d3.hierarchy({children: type.filter(d=> {return d.Year === +selectedYear })})
.sum(d => d.Count);

    // Compute the pack layout
    const nodes = pack(root).leaves();
    
    const bubbles = svg3.selectAll(".bubble")
    .data(nodes)
    .join("circle")
      .classed("bubble", true)
      .attr("r", d=> { return d.r; })
      .attr("cx", d=> { return d.x; })
      .attr("cy", d=> { return d.y; })
      .style("fill", d=> { 
        console.log(d)
        return colorScale(d.data.Classification); });

      const labels = svg3.selectAll(".label")
      .data(nodes)
      .join("text")
        .classed("label", true)
        .attr("x", d=>{ return d.x; })
        .attr("y", d=> { return d.y; })
        .text(d => d.data.Count.toLocaleString());

        const legend = d3.legendColor()
        .shapePadding(5)
        //.shapeWidth(40)
        .scale(colorScale)
        .title("Classification")
        .labelOffset(39);

        svg3.append("g")
        .attr("transform", "translate(580,100)")
        .call(legend); 
  }

 })
.catch(error => console.log(error))
