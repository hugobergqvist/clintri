//Load data
loadJSON = () => {
  return new Promise(function (resolve, reject) {
    modifyIncomingData().then(data => {
      resolve(data);
    });
  });
};

// Temporary solution for HWD. @TODO: Try and implement condition handling in a better way
var condition = "";

const setCondition = (newCondition) => {
  condition = newCondition;
};

const getCondition = (newCondition) => {
  return condition;
};
// -----------------------

//Load data regarding the sankey tree
loadSankeytree = (callback) => {
  const currentCondition = getCondition();
  handleSankeyTreeData(currentCondition, callback);
};

// Handle the search
searchfunction = e => {};

addSankeyTree = data => {
  buildSankeyTree(data);
};

addTreeMap = data => {
  // Add new treemap
  buildTreeMap(data);
  //var newTreemap = document.createElement("div");
  //newTreemap.classList.add("treemap");
  //newTreemap.setAttribute("id", "treemap");

  // ADD TREEMAP: newTreemap.appendChild(treemap);
  //var newContent = document.createTextNode("Hi there and greetings!");
  //newTreemap.appendChild(newContent);

  // Add Legend
  //var newLegend = document.createElement("LEGEND");
  //var legendText = document.createTextNode("NewLegend:");  // Make dynamic with incoming data!!
  //newLegend.appendChild(legendText);

  // Add Fieldset
  //var newFieldset = document.createElement("fieldset");
  //newFieldset.appendChild(newLegend);
  //newFieldset.appendChild(newTreemap);

  // Add entire new div with all its children
  //var newDiv = document.createElement("div");
  //newDiv.classList.add("categories");
  //newDiv.appendChild(newFieldset);

  // Find the wrapper containing all categories and push the new element
  //var wrapperDiv = document.getElementById("categorieContainer");
  //wrapperDiv.appendChild(newDiv);
};

// This function builds the d3-treemap component
buildTreeMap = data => {
  // set the dimensions and margins of the graph
  var margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
    width = 1600 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#categorieContainer")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Give the data to this cluster layout:
  var root = d3.hierarchy(data).sum(function (d) {
    return d.value;
  }); // Here the size of each leave is given in the 'value' field in input data

  // Then d3.treemap computes the position of each element of the hierarchy
  d3
    .treemap()
    .size([width, height])
    .padding(2)(root);

  //Mouseover transitions
  let mouseOver = function (d) {
    d3.selectAll(".leaf")
      .transition()
      .duration(200)
      .style("opacity", 0.5);
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1);
  };

  let mouseLeave = function (d) {
    d3.selectAll(".leaf")
      .transition()
      .duration(200)
      .style("opacity", 0.8);
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent");
  };

  let mouseClick = function (d) {
    d3.select(this)
      .transition()
      .duration(70)
      .style("opacity", 1)
      .style("stroke", "black")
      .style("stroke-width", "5")
      .transition()
      .duration(70)
      .style("stroke", "transparent");

    //Gets the name of the clicked rectangle
    let attribute = this.getAttribute("name");
    console.log(attribute);
  };

  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return d.x0;
    })
    .attr("y", function (d) {
      return d.y0;
    })
    .attr("width", function (d) {
      return d.x1 - d.x0;
    })
    .attr("height", function (d) {
      return d.y1 - d.y0;
    })
    .attr("class", "leaf")
    .attr("name", function (d) {
      return d.data.name;
    })
    .style("stroke", "black")
    .style("fill", function (d) {
      let values = getMaxMinLeafValues(root);

      let normLeafValue =
        (d.value - values.leafMin) / (values.leafMax - values.leafMin);

      const colorScale = [
        "#8dd3c7",
        "#ffffb3",
        "#bebada",
        "#fb8072",
        "#80b1d3",
        "#fdb462",
        "#b3de69",
        "#fccde5",
        "#d9d9d9",
        "#bc80bd"
      ];

      return colorScale[Math.round(normLeafValue * 10)];
    })
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .on("click", mouseClick);

  // let colorScar = ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]

  // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", function (d) {
      return d.x0 + 5;
    }) // +10 to adjust position (more right)
    .attr("y", function (d) {
      return d.y0 + 20;
    }) // +20 to adjust position (lower)
    .text(function (d) {
      return d.data.name;
    })
    .attr("font-size", "15px")
    .attr("fill", "white");
};

getMaxMinLeafValues = rootData => {
  let leaves = rootData.leaves();
  let leafValues = [];

  leaves.forEach(myFunction);

  //Build list of leaf vaslues to use later for color scheme
  function myFunction(leafValue, index, array) {
    leafValues.push(leafValue.value);
  }

  const leafMax = Math.max.apply(Math, leafValues);
  const leafMin = Math.min.apply(Math, leafValues);

  return {
    leafMax: leafMax,
    leafMin: leafMin
  };
};

main = () => {
  loadJSON().then(function (JSON_data) {
    addTreeMap(JSON_data);
  });
  /*loadSankeytree().then(function(data) {
    addSankeyTree(data);
  });*/
};

const createSankeytree = () => {
  loadSankeytree(addSankeyTree);
}
main();