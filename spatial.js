const width2 = 960;
const height2 = 600;

const canvas2 = d3.select("#map");

const svg2 = canvas2.append("svg")
    .attr('width', width2)
    .attr("height", height2);

const projection = d3.geoMercator()
  .center([-97, 38])
  .scale(1000)
  .translate([width2 / 2, height2 / 2]);

const path = d3.geoPath().projection(projection);

// Initialize the tooltip
const tooltip2 = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("text-align", "center")
  .style("padding", "8px")
  .style("font-size", "12px")
  .style("background", "rgba(0, 0, 0, 0.75)")
  .style("color", "white")
  .style("border-radius", "4px")
  .style("pointer-events", "none")
  .style("display", "none");  // Initially hidden

// Load US states GeoJSON
d3.json("https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json").then(us => {
  svg2.append("g")
    .selectAll("path")
    .data(us.features)
    .enter().append("path")
    .attr("d", path)
    .style("fill", "#d3d3d3")
    .style("stroke", "#ffffff");

  d3.csv("school-shootings.csv").then(data => {
    const filtered = data.filter(d => d.lat && d.long);

    svg2.selectAll(".bubble")
      .data(filtered)
      .enter().append("circle")
      .attr("class", "bubble")
      .attr("cx", d => projection([+d.long, +d.lat])[0])
      .attr("cy", d => projection([+d.long, +d.lat])[1])
      .attr("r", 5)
      .style("fill", "crimson")
      .on("mouseover", function(event, d) {
        tooltip.style("display", "block")
          .html(`<strong>State:</strong> ${d.state}<br><strong>School:</strong> ${d.school_name}<br><strong>Fatalities:</strong> ${d.killed}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 30) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      });
  });
});
