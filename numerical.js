// Set dimensions for the SVG canvas and margins
const margin3 = { top: 30, right: 20, bottom: 70, left: 80 };
const width3 = 960 - margin3.left - margin3.right;
const height3 = 1000 - margin3.top - margin3.bottom;

// Append SVG to the canvas
const svg3 = d3.select("#canvas3").append("svg")
  .attr("width", width3 + margin3.left + margin3.right)
  .attr("height", height3 + margin3.top + margin3.bottom)
  .append("g")
  .attr("transform", `translate(${margin3.left},${margin3.top})`);

// Initialize tooltip for mouseover interaction
const tooltip3 = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("text-align", "center")
  .style("padding", "10px")
  .style("font-size", "26px")
  .style("background", "rgba(0, 0, 0, 0.7)")
  .style("color", "white")
  .style("border-radius", "5px")
  .style("pointer-events", "none")
  .style("display", "none");  // Initially hidden

// Load the data
d3.csv("school-shootings.csv").then(function(data3) {

  // Aggregate shooters by gender (assuming 'gender_shooter1' and 'gender_shooter2' columns exist)
  const groupedData3 = d3.group(data3, d => {
    const rawGender = d.gender_shooter1 || d.gender_shooter2 || "Unknown";
    const gender = rawGender.toLowerCase();
  
    if (gender === "m") return "Male";
    if (gender === "f") return "Female";
    return "Unknown";
  });
  
  const aggregatedData3 = Array.from(groupedData3, ([gender, incidents]) => ({
    shooter_gender: gender,
    totalIncidents: incidents.length  // Count number of incidents for each shooter gender
  }));

  // Create scales for x and y axes
  const x3 = d3.scaleBand()
    .domain(aggregatedData3.map(d => d.shooter_gender))
    .range([0, width3])
    .padding(0.1);  // Space between bars

  const y3 = d3.scaleLinear()
    .domain([0, d3.max(aggregatedData3, d => d.totalIncidents)])
    .nice()  // Make the axis values more readable
    .range([height3, 0]);

// Add x-axis
svg3.append("g")
  .attr("transform", `translate(0, ${height3})`)
  .call(d3.axisBottom(x3))
  .selectAll("text")
  .style("font-size", "20px");

// Add y-axis
svg3.append("g")
  .call(d3.axisLeft(y3))
  .selectAll("text")
  .style("font-size", "20px");


  // Create bars based on aggregated data
  svg3.selectAll(".bar3")
    .data(aggregatedData3)
    .enter().append("rect")
    .attr("class", "bar3")
    .attr("x", d => x3(d.shooter_gender))
    .attr("y", d => y3(d.totalIncidents))
    .attr("width", x3.bandwidth())
    .attr("height", d => height3 - y3(d.totalIncidents))
    .style("fill", "steelblue")
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
      tooltip3.style("display", "block")
        .html(`Shooter Gender: ${d.shooter_gender}<br>Total Incidents: ${d.totalIncidents}`)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
      tooltip3.style("display", "none");
    });
  
  // Add X-axis label
  svg3.append("text")
    .attr("transform", `translate(${width3 / 2}, ${height3 + margin3.bottom - 10})`)
    .style("text-anchor", "middle")
    .style("font-size", "30px")
    .text("Shooter Gender");

  // Add Y-axis label
  svg3.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin3.left + 25)
    .attr("x", -height3 / 2)
    .style("text-anchor", "middle")
    .style("font-size", "30px")
    .text("Total Incidents");

}).catch(function(error3) {
  console.error('Error loading the dataset:', error3);
});
