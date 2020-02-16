

// Handle the search
searchfunction = (e) => {

}

addTreeMap = () => {

    // Add new treemap
    var newTreemap = document.createElement("div");
    newTreemap.classList.add("treemap");
    newTreemap.setAttribute("id", "treemap_cancer");
    buildTreeMap()

    // ADD TREEMAP: newTreemap.appendChild(treemap);
    var newContent = document.createTextNode("Hi there and greetings!");
    newTreemap.appendChild(newContent);

    // Add Legend
    var newLegend = document.createElement("LEGEND");
    var legendText = document.createTextNode("NewLegend:");  // Make dynamic with incoming data!!
    newLegend.appendChild(legendText);

    // Add Fieldset
    var newFieldset = document.createElement("fieldset");
    newFieldset.appendChild(newLegend);
    newFieldset.appendChild(newTreemap);

    // Add entire new div with all its children
    var newDiv = document.createElement("div");
    newDiv.classList.add("categories");
    newDiv.appendChild(newFieldset);

    // Find the wrapper containing all categories and push the new element
    var wrapperDiv = document.getElementById("categorieContainer");
    wrapperDiv.appendChild(newDiv);
}

buildTreeMap = () => {

    console.log("hej")

    // set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
width = 1600 - margin.left - margin.right,
height = 1000 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#treemap_cancer")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// read json data
d3.json("./script/data.json", function(data) {
console.log(data)
// Give the data to this cluster layout:
var root = d3.hierarchy(data).sum(function(d){ return d.value}) // Here the size of each leave is given in the 'value' field in input data

// Then d3.treemap computes the position of each element of the hierarchy
d3.treemap()
  .size([width, height])
  .padding(2)
  (root)

// use this information to add rectangles:
svg
  .selectAll("rect")
  .data(root.leaves())
  .enter()
  .append("rect")
    .attr('x', function (d) { return d.x0; })
    .attr('y', function (d) { return d.y0; })
    .attr('width', function (d) { return d.x1 - d.x0; })
    .attr('height', function (d) { return d.y1 - d.y0; })
    .style("stroke", "black")
    .style("fill", "slateblue")

// and to add the text labels
svg
  .selectAll("text")
  .data(root.leaves())
  .enter()
  .append("text")
    .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
    .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
    .text(function(d){ return d.data.name })
    .attr("font-size", "15px")
    .attr("fill", "white")
})

}

