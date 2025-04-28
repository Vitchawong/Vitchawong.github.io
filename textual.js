d3.csv("school-shootings.csv").then(data => {
    // Normalize and group "suicide" types
    const shootingTypes = data
      .map(d => d.shooting_type)
      .filter(d => d && d.trim() !== "")
      .map(d => {
        const type = d.toLowerCase().trim();
        return type.includes("suicide") ? "suicide" : type;
      });
  
    const freqMap = d3.rollup(shootingTypes, v => v.length, d => d);
    const freqData = Array.from(freqMap, ([type, count]) => ({ type, count }));
  
    // Sort by frequency
    freqData.sort((a, b) => b.count - a.count);
  
    // Dimensions
    const fullWidth = 1200;
    const fullHeight = 1000;
    const margin = { top: 100, right: 20, bottom: 100, left: 250 };
    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;
  
    const svg = d3.select("#canvas4").append("svg")
      .attr("width", fullWidth)
      .attr("height", fullHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("text-align", "center")
      .style("padding", "20px")
      .style("font-size", "26px")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("display", "none");
  
    // Scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(freqData, d => d.count)])
      .range([0, width])
      .nice();
  
    const y = d3.scaleBand()
      .domain(freqData.map(d => d.type))
      .range([0, height])
      .padding(0.2);
  
    // Axes with font size 20
    svg.append("g")
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll("text")
      .style("font-size", "20px");
  
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll("text")
      .style("font-size", "20px");
  
    // Bars
    svg.selectAll("rect")
      .data(freqData)
      .enter()
      .append("rect")
      .attr("y", d => y(d.type))
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("width", d => x(d.count))
      .attr("fill", "#69b3a2")
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        tooltip.style("display", "block")
          .html(`<strong>${d.type}</strong><br>Incidents: ${d.count}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"));
  
    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .style("font-size", "30px")
      .text("Frequency of Shooting Types");
  
    // X-axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 60)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Number of Incidents");
  });
  