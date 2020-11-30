var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import CSV Data
d3.csv("assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;
    console.log(censusData);
// Format the data
   
    censusData.forEach(function(data) {
        data.poverty = +data.poverty
        data.healthcare= +data.healthcare
        });

  // Create scales
    var xLinearScale = d3.scaleLinear()
    .domain([d3.max(censusData, d => d.poverty)])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([d3.max(censusData, d => d.healthcare)])
    .range([height, 0]);

//Create axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

// append y axis
    chartGroup.append("g")
    .call(leftAxis);

// append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".5");

//append labels to chart
    var circlesGroup = chartGroup.selectAll()
    .data(censusData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .style("font-size", "10px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr))

//tool tip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>HealthCare: ${d.healthcare}`);
        });

    circlesGroup.call(toolTip);

//Create mouseover and mouseout events 
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
// onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", -50 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .text("Lacks Healthcare %");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty % ");

}).catch(function(error) {
  console.log(error);
});

