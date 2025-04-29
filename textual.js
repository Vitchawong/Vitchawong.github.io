d3.csv("school-shootings.csv").then(data => {
  // Normalize and group shooting types
  const normalizeType = (rawType) => {
    const type = rawType.toLowerCase().trim();

    if (type.includes("suicide")) return "suicide";

    const typeMap = {
      "unclear": "unclear",
      "unknown": "unclear",
      "not specified": "unclear",
      "n/a": "unclear",
      "unspecified": "unclear",
      "uclear": "unclear"
    };

    return typeMap[type] || type;
  };

  const shootingTypes = data
    .map(d => d.shooting_type)
    .filter(d => d && d.trim() !== "")
    .map(normalizeType);

  const freqMap = d3.rollup(shootingTypes, v => v.length, d => d);
  const freqData = Array.from(freqMap, ([type, count]) => ({ type, count }));

  freqData.sort((a, b) => b.count - a.count);

  const width = 1200;
  const height = 1000;

  const svg = d3.select("#canvas4").append("svg")
    .attr("width", width)
    .attr("height", height);

  const tooltip = d3.select("body").append("div")
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

  // Hierarchy and pack layout
  const root = d3.hierarchy({ children: freqData })
    .sum(d => d.count * 25); // Increase size ~5×
    
  const pack = d3.pack()
    .size([width, height])
    .padding(10);

  const nodes = pack(root).leaves();

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const node = svg.selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x},${d.y})`);

  node.append("circle")
    .attr("r", d => d.r)
    .style("fill", d => color(d.data.type))
    .style("cursor", "pointer")
    .on("mouseover", function (event, d) {
      tooltip.style("display", "block")
        .html(`<strong>${d.data.type}</strong><br>Incidents: ${d.data.count}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => tooltip.style("display", "none"));

  node.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .style("font-size", d => Math.min(d.r / 2, 24))
    .style("fill", "white")
    .text(d => d.data.type
      .split(" ")
      .map(w => w[0].toUpperCase())
      .join(""));

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .style("font-size", "30px")
    .text("School Shootings: Frequency of Shooting Types");

});
