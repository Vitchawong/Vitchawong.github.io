const width3 = 800;
const height3 = 800;
const margin3 = 100;
const radius = Math.min(width3, height3) / 2 - margin3;

const svg3 = d3.select("#canvas3").append("svg")
  .attr("width", width3)
  .attr("height", height3)
  .append("g")
  .attr("transform", `translate(${width3 / 2}, ${height3 / 2})`);

// Tooltip
const tooltip3 = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("text-align", "center")
  .style("padding", "10px")
  .style("font-size", "20px")
  .style("background", "rgba(0, 0, 0, 0.7)")
  .style("color", "white")
  .style("border-radius", "5px")
  .style("pointer-events", "none")
  .style("display", "none");

d3.csv("school-shootings.csv").then(function(data3) {
  // Aggregate gender data
  const groupedData = d3.group(data3, d => {
    const rawGender = d.gender_shooter1 || d.gender_shooter2 || "Unknown";
    const gender = rawGender.toLowerCase();
    if (gender === "m") return "Male";
    if (gender === "f") return "Female";
    return "Unknown";
  });

  const aggregatedData = Array.from(groupedData, ([gender, incidents]) => ({
    shooter_gender: gender,
    totalIncidents: incidents.length
  }));

  // Pie generator
  const pie = d3.pie()
    .value(d => d.totalIncidents)
    .sort(null);

  const data_ready = pie(aggregatedData);

  // Arc generator
  const arc = d3.arc()
    .innerRadius(radius * 0.5) // Donut hole
    .outerRadius(radius * 0.9);

  // Color scale
  const color = d3.scaleOrdinal()
    .domain(aggregatedData.map(d => d.shooter_gender))
    .range(d3.schemeSet2);

  // Draw slices
  svg3.selectAll("path")
    .data(data_ready)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.shooter_gender))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .on("mouseover", function(event, d) {
      tooltip3.style("display", "block")
        .html(`Shooter Gender: ${d.data.shooter_gender}<br>Total Incidents: ${d.data.totalIncidents}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => tooltip3.style("display", "none"));

  // Add labels inside arcs
  const labelArc = d3.arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius * 0.6);

  svg3.selectAll("text")
    .data(data_ready)
    .enter()
    .append("text")
    .text(d => d.data.shooter_gender)
    .attr("transform", d => `translate(${labelArc.centroid(d)})`)
    .style("text-anchor", "middle")
    .style("font-size", "20px");

  // Title
  svg3.append("text")
    .attr("x", 0)
    .attr("y", -height3 / 2 + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "30px")
    .text("Shooter Gender Distribution");
}).catch(function(error3) {
  console.error('Error loading the dataset:', error3);
});
