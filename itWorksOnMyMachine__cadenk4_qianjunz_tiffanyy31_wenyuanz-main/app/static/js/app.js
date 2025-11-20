const width = 960;
const height = 500;
const svg = d3.select("#map")
    .attr("width", width)
    .attr("height", height);

const projection = d3.geoMercator()
    .scale(130)
    .translate([width / 2, height / 1.5]);

const path = d3.geoPath().projection(projection);

const colorScale = d3.scaleThreshold()
    .domain([10, 50, 100, 200, 300, 500, 1000])
    .range(d3.schemeBlues[8]);

const legendData = [
    { label: "0-10", color: colorScale(5) },
    { label: "10-50", color: colorScale(30) },
    { label: "50-100", color: colorScale(75) },
    { label: "100-200", color: colorScale(150) },
    { label: "200-300", color: colorScale(250) },
    { label: "300-500", color: colorScale(400) },
    { label: "500-1000", color: colorScale(750) },
    { label: "1000+", color: colorScale(1500) }
];

const legend = d3.select("#legend");
legend.selectAll(".legend-item")
    .data(legendData)
    .enter()
    .append("div")
    .attr("class", "legend-item")
    .html(d => `
        <span class="legend-color" style="background-color:${d.color}"></span>
        <span>${d.label}</span>
    `);

Promise.all([
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
    d3.csv("https://gist.githubusercontent.com/bumbeishvili/8b5b846a5e7c1723c3d9f6738a0a7733/raw/7d1f9d6e4e0a8e5e6f65d5f4f5f9f9b9b9b9b9b9b/world_population_density.csv")
]).then(([world, populationData]) => {
    const populationMap = {};
    populationData.forEach(d => {
        populationMap[d.country] = +d.density;
    });

    const countries = topojson.feature(world, world.objects.countries).features;

    svg.selectAll("path")
        .data(countries)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", d => {
            const countryName = d.properties.name;
            const density = populationMap[countryName];
            return density ? colorScale(density) : "#ccc";
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .append("title")
        .text(d => {
            const countryName = d.properties.name;
            const density = populationMap[countryName];
            return `${countryName}: ${density ? density + ' people/km²' : 'No data'}`;
        });
}).catch(error => {
    console.error("Error loading the data:", error);
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .text("Error loading map data");
});
var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13
});