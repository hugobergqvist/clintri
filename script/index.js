//stateHandler is now in stateHandler.js

let currentPage = "HomePage";

const setCurrentPage = newPage => {
  currentPage = newPage;
  drawMarker();
};

const getCurrentPage = newPage => {
  return currentPage;
};

const setBoldText = elementID => {
  const element = document.getElementById(elementID);
  if (!element.classList.contains("boldText")) {
    element.classList.add("boldText");
  }
};

const removeBoldText = elementID => {
  const element = document.getElementById(elementID);
  if (element.classList.contains("boldText")) {
    element.classList.remove("boldText");
  }
};

//Load data
loadJSON = () => {
  return new Promise(function(resolve, reject) {
    modifyIncomingData().then(data => {
      resolve(data);
    });
  });
};

// Temporary solution for HWD. @TODO: Try and implement condition handling in a better way1
var condition = "Heart attack";

const setCondition = newCondition => {
  condition = newCondition;
};

const getCondition = newCondition => {
  return condition;
};
// -----------------------

GoToHome = () => {
  //location.reload();
  location.href = "index.html";
};

console.log("Current page: ", getCurrentPage());

GoToSankeyTree = () => {
  const condition = getCondition();
  document.getElementById("breadcrumbSankey").innerHTML = condition;
  const singleStudy = document.getElementById("singleStudy");
  const phaseContentListContainer = document.getElementById(
    "phaseContentListContainer"
  );
  singleStudy.style.display = "none";
  phaseContentListContainer.style.display = "none";

  // Set and remove boldtext
  setBoldText("breadcrumbSankey");
  removeBoldText("breadcrumbHome");

  setCurrentPage("SankeyPage");
  console.log("Current page: ", getCurrentPage());

  createSankeytree(condition);
};

// GoToList = () => {
//   // FILL IN!!
// };

let CurrentData = {
  // Nodes and links
  data: [],
  // Object of the data
  listData: []
};

let FetchedData = [];

const setFetchedData = data => {
  FetchedData.push(...data);
};

const getFetchedData = () => {
  return FetchedData;
};

// This saves the data that was previously used, so it can get accessed without calling the API again
setCurrentData = (data, listData) => {
  CurrentData.data = data;
  CurrentData.listData = listData;
  console.log(CurrentData.listData);
  // console.log("CURRENTDATA = ", CurrentData);
};

// This function returns a JSON object of the current data. To use it and build sankey-tree use:
//      buildSankeyTree(data, listData).then(() => {
//        stateHandler("loaded");
//        setCurrentData(data, listData);
//       });

getCurrentData = () => {
  return CurrentData;
};

//Load data regarding the sankey tree
loadSankeytree = callback => {
  const currentCondition = getCondition();
  handleSankeyTreeData(currentCondition, callback);
};

handleLogoClick = () => {
  var treeDiv = document.getElementById("treeMapContainer");
  var sankeyDiv = document.getElementById("sankeyContainer");
  sankeyDiv.style.display = "none";
  treeDiv.style.display = "grid";
};

// Handle the search
// searchfunction = e => { };

addSankeyTree = (data, listData) => {
  var treeDiv = document.getElementById("treeMapContainer");
  treeDiv.style.display = "none";
  var sankeyDiv = document.getElementById("sankeyContainer");
  sankeyDiv.style.display = "grid";
  const singleStudy = document.getElementById("singleStudy");
  const phaseContentListContainer = document.getElementById(
    "phaseContentListContainer"
  );
  singleStudy.style.display = "none";
  phaseContentListContainer.style.display = "none";

  // Set and remove boldtext
  setBoldText("breadcrumbSankey");
  removeBoldText("breadcrumbHome");

  buildSankeyTree(data, listData).then(() => {
    stateHandler("loaded");
    setCurrentData(data, listData);
  });
};

addTreeMap = data => {
  // Add new treemap
  buildTreeMap(data);
};

// This function builds the d3-treemap component
buildTreeMap = data => {
  // set the dimensions and margins of the graph
  var margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    //width = 1600 - margin.left - margin.right,
    width = window.innerWidth - 40;
  //height = 1000 - margin.top - margin.bottom;
  height = window.innerHeight - 240;

  // append the svg object to the body of the page
  var svg = d3
    .select("#treeMapContainer")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Give the data to this cluster layout:
  var root = d3.hierarchy(data).sum(function(d) {
    return d.value;
  }); // Here the size of each leave is given in the 'value' field in input data

  // Then d3.treemap computes the position of each element of the hierarchy
  d3
    .treemap()
    .size([width, height])
    .padding(2)(root);

  //Mouseover transitions
  let mouseOver = function(d) {
    d3.selectAll(".leaf")
      .transition()
      .duration(200)
      .style("opacity", 0.5);
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1);
  };

  let mouseLeave = function(d) {
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
  let mousemove = function(d) {
    var xPosition = d3.event.pageX + 5;
    var yPosition = d3.event.pageY + 5;
    d3.select("#tooltip")
      .style("left", xPosition + "px")
      .style("top", yPosition + "px");
    d3.select("#tooltip #name").text(d.data.name);
    d3.select("#tooltip #value").text("Number of studies: " + d.data.value);
    d3.select("#tooltip").classed("hidden", false);
  };
  let mouseout = function(d) {
    d3.select("#tooltip").classed("hidden", true);
  };

  // Move to SankeyTree
  let mouseClick = function(d) {
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
    .attr("x", function(d) {
      return d.x0;
    })
    .attr("y", function(d) {
      return d.y0;
    })
    .attr("width", function(d) {
      return d.x1 - d.x0;
    })
    .attr("height", function(d) {
      return d.y1 - d.y0;
    })
    .attr("class", "leaf")
    .attr("name", function(d) {
      return d.data.name;
    })
    .style("fill", function() {
      const colorScale = [
        "#EC407B",
        "#D34747",
        "#E91F63",
        "#F24182",
        "#D335EE",
        "#9D27B0",
        "#673BB7",
        "#3F51B5",
        "#3D96F2",
        "#43A9F3",
        "#47BCD3",
        "#4BC6DA",
        "#359688",
        "#4CB050",
        "#57C85B",
        "#8BC34A",
        "#CCDC3A",
        "#C7FF04",
        "#F6C00B",
        "#F49803",
        "#F15823"
      ];
      //console.log(Math.floor(Math.random() * Math.floor(20)))
      if (i >= 20) {
        i = 0;
      } else {
        i += 1;
      }
      return colorScale[i];
    })
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout)
    .on("click", mouseClick);

  // and to add the text labels
  let previousX = 0;
  let previousY = 0;

  let text = svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", d => d.x0 + 5)
    .attr("y", d => d.y0 + 20)
    .attr("transform", function(d) {
      var rect_width = Math.round(d.x1 - d.x0);
      if (rect_width < 70) {
        hasRotated = true;
        previousX = d.x0 + 10;
        previousY = d.y0 + 20;
        return "rotate(" + 90 + "," + previousX + "," + previousY + ")";
      }
    })
    .on("click", function(d) {
      const studyTitle = d.data.name;
      console.log(studyTitle);

      createSankeytree(studyTitle);
    });

  text
    .append("tspan")
    .text(function(d) {
      var rect_width = Math.round(d.x1 - d.x0);
      var rect_height = Math.round(d.y1 - d.y0);
      var string = d.data.name;

      if (rect_width > 60) {
        if (string.length * 10 > rect_width) {
          string = string.substring(0, rect_width / 7);
          if (string != d.data.name && rect_width > 40) {
            string = string + "..";
          }
        }
      }

      if (rect_width < 70) {
        var rect_width = Math.round(d.x1 - d.x0);
        if (string.length * 10 > rect_height) {
          string = string.substring(0, rect_height / 15);
          if (string != d.data.name && rect_height > 40) {
            string = string + ".. ";
          }
        }
        var string = string + " (" + d.data.value + ")";
      }

      return string;
    })
    .attr("font-size", function(d) {
      var height = Math.round(d.y1 - d.y0);
      if (height < 20) {
        return "0px";
      } else {
        return "13px";
      }
    })
    .attr("fill", "white");

  text
    .append("tspan")
    .text(function(d) {
      var rect_width = Math.round(d.x1 - d.x0);
      var string = "";
      if (rect_width > 70) {
        var string = "(" + d.data.value + ")";
        var rect_width = Math.round(d.x1 - d.x0);
        if (string.length * 10 > rect_width) {
          string = string.substring(0, rect_width / 7);
        }
        return string;
      }
    })
    .attr("font-size", function(d) {
      var height = Math.round(d.y1 - d.y0);
      if (height < 40) {
        return "0px";
      } else {
        return "10px";
      }
    })
    .attr("fill", "white")
    .attr("x", d => d.x0 + 5)
    .attr("y", d => d.y0 + 40);

  text
    .selectAll("tspan.text")
    .enter()
    .append("tspan")
    .attr("class", "text")
    .text(d => d);
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
  loadJSON().then(function(JSON_data) {
    addTreeMap(JSON_data);
  });
  /*loadSankeytree().then(function(data) {
    addSankeyTree(data);
  });*/
};

const createSankeytree = condition => {
  setCondition(condition);
  stateHandler("loading"); //Sets loading state to control loader animation, state: loaded is set after invoking function buildsankeytree()
  loadSankeytree(addSankeyTree);
};
main();
