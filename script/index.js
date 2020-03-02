stateHandler = (state) => {

  //Accepts strings "loading" and "loaded"

  let loaderDiv = document.getElementById("loader");
  let treeMapDiv = document.getElementById("treeMapContainer");

  if (state == "loading") {

    loaderDiv.classList.remove("hideLoader");
    treeMapDiv.style.display = "none";
  }

  if (state == "loaded") {
    loaderDiv.classList.add("hideLoader");
    //treeMapDiv.style.display = "block";
  }

  else {
    //loaderDiv.classList.add("hideLoader");
    //console.log("ERROR, stateHandler error")
  }

}

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

const setCondition = newCondition => {
  condition = newCondition;
};

const getCondition = newCondition => {
  return condition;
};
// -----------------------

//Load data regarding the sankey tree
loadSankeytree = callback => {

  const currentCondition = getCondition();
  handleSankeyTreeData(currentCondition, callback);

};

// Handle the search
searchfunction = e => { };

addSankeyTree = data => {
  var treeDiv = document.getElementById("treeMapContainer");
  treeDiv.style.display = "none";
  var sankeyDiv = document.getElementById("sankeyContainer");
  sankeyDiv.style.display = "grid";
  buildSankeyTree(data).then(stateHandler("loaded"));
};

addTreeMap = data => {
  // Add new treemap
  buildTreeMap(data);
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
    .select("#treeMapContainer")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
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
      .style("opacity", 1);
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent");
  };

  // Tooltip
  let mousemove = function (d) {
    var xPosition = d3.event.pageX + 5;
    var yPosition = d3.event.pageY + 5;
    d3.select("#tooltip")
      .style("left", xPosition + "px")
      .style("top", yPosition + "px");
    d3.select("#tooltip #name")
      .text(d.data.name);
    d3.select("#tooltip #value")
      .text("Number of studies: " + d.data.value);
    d3.select("#tooltip").classed("hidden", false);
  }
  let mouseout = function (d) {
    d3.select("#tooltip").classed("hidden", true);
  }

  // Move to SankeyTree
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
    createSankeytree(attribute);
  };

  // use this information to add rectangles:
  var i = 0;
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
    .style("fill", function () {

      const colorScale = [
        "#EC407B", "#D34747", "#E91F63", "#F24182", "#D335EE", "#9D27B0", "#673BB7", "#3F51B5", "#3D96F2",
        "#43A9F3", "#47BCD3", "#4BC6DA", "#359688", "#4CB050", "#57C85B", "#8BC34A", "#CCDC3A", "#C7FF04",
        "#F6C00B", "#F49803", "#F15823"
      ];
      //console.log(Math.floor(Math.random() * Math.floor(20)))
      if (i >= 20) { i = 0 }
      else { i += 1; }
      return colorScale[i];
    })
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout)
    .on("click", mouseClick);

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
      var string = d.data.name
      var rect_width = Math.round(d.x1 - d.x0)
      if (string.length * 10 > rect_width) {
        string = string.substring(0, rect_width / 7)
      }
      return string;
    })
    /* .attr("textLength", function (d) {
      var width = Math.round(d.x1 - d.x0 - 10)
      var widthString = width.toString()
      var string = widthString + "px"
      return string;
    })
    .attr("lengthAdjust", "spacingAndGlyphs") */
    .attr("font-size", function (d) {
      var height = Math.round(d.y1 - d.y0)
      if (height < 20) {
        return "0px"
      } else {
        return "13px";
      }
    })
    .attr("fill", "white")
    .attr("word-wrap", "break-word")
    .attr("white-space", "nowrap")
    .attr("overflow", "hidden");

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

const createSankeytree = condition => {

  setCondition(condition);
  stateHandler("loading")//Sets loading state to control loader animation, state: loaded is set after invoking function buildsankeytree()
  loadSankeytree(addSankeyTree);
};
main();
