const canvas = d3.select("#canvas");

const svg5 = canvas.append("svg")
  .attr('width', 1200)
  .attr("height", 1000);

const margin = { top: 100, right: 20, bottom: 100, left: 80 };
const graphWidth = 1200 - margin.left - margin.right;
const graphHeight = 1000 - margin.top - margin.bottom;

const graph = svg5.append('g')
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip
const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("text-align", "center")
  .style("padding", "10px")
  .style("font-size", "26px")
  .style("background", "rgba(0, 0, 0, 0.7)")
  .style("color", "white")
  .style("border-radius", "5px")
  .style("pointer-events", "none")
  .style("display", "none");

d3.csv("school-shootings.csv").then(function(data) {
  const groupedData = d3.group(data, d => d.state);
  const aggregatedData = Array.from(groupedData, ([state, incidents]) => ({
    state: state,
    totalCasualties: d3.sum(incidents, d => +d.killed + +d.injured)
  }));

  const x = d3.scaleBand()
    .domain(aggregatedData.map(d => d.state))
    .range([0, graphWidth])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(aggregatedData, d => d.totalCasualties)])
    .nice()
    .range([graphHeight, 0]);

  const radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(aggregatedData, d => d.totalCasualties)])
    .range([5, 40]);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Axes
  const xAxis = d3.axisBottom(x).tickFormat(d => d).tickSize(0);
  const yAxis = d3.axisLeft(y).ticks(10);

  graph.append("g")
  .attr("transform", `translate(0, ${graphHeight})`)
  .call(xAxis)
  .selectAll("text")
  .remove();


  graph.append("g")
  .call(yAxis)
  .selectAll("text")
  .style("font-size", "20px"); // <-- Change the size as needed


  // Axis labels
  svg5.append("text")
    .attr("x", margin.left + graphWidth / 2)
    .attr("y", margin.top + graphHeight + 60)
    .attr("text-anchor", "middle")
    .style("font-size", "30px")
    .text("State in Alphabetical Order");

  svg5.append("text")
    .attr("x", -(margin.top + graphHeight / 2)+20)
    .attr("y", 26)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .style("font-size", "30px")
    .text("Total Casualties");

  // Title
  svg5.append("text")
    .attr("x", margin.left + graphWidth / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .style("font-size", "30px")
    .text("School Shootings: Total Casualties by State (1990–2025)");

  // Bubbles
  graph.selectAll(".bubble")
    .data(aggregatedData)
    .enter()
    .append("circle")
    .attr("class", "bubble")
    .attr("cx", d => x(d.state) + x.bandwidth() / 2 + 22) // 👈 tweak '20' as needed
    .attr("cy", d => y(d.totalCasualties))
    .attr("r", d => radiusScale(d.totalCasualties))
    .style("fill", d => color(d.state))
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
      tooltip.style("display", "block")
        .html(`State: ${d.state}<br>Total Casualties: ${d.totalCasualties}`)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("display", "none");
    });

}).catch(function(error) {
  console.error('Error loading the dataset:', error);
});
