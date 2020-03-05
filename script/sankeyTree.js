buildSankeyTree = (data, phaseData) => {
  return (
    new Promise(function(resolve, reject) {
      // set the dimensions and margins of the graph
      var sankeyDiv = document.getElementById("sankeyContainer");
      var divWidth = sankeyDiv.offsetWidth;
      var divHeight = sankeyDiv.offsetHeight;
      if (divHeight < 400) {
        divHeight = 500;
      }
      var margin = {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        },
        width = divWidth - margin.left - margin.right, // Kanske går att lägga inherit här istället men det påverkar möjligheten att visa upp allt
        height = divHeight - margin.top - margin.bottom;

      // Remove previous component
      const existing_element = document.querySelector("#sankeyContainer");
      const child = existing_element.firstElementChild;
      if (child) {
        existing_element.removeChild(child);
      }

      // append the svg object to the body of the page
      var svg = d3
        .select("#sankeyContainer")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Color scale used
      var color = d3.scaleOrdinal(d3.schemeCategory20);

      // Set the sankey diagram properties
      var sankey = d3
        .sankey()
        .nodeWidth(20)
        .nodePadding(50)
        .size([width, height]);

      // Constructs a new Sankey generator with the default settings.
      sankey
        .nodes(data.nodes)
        .links(data.links)
        .layout(0);

      //Phase content list view builder
      function buildPhaseContentList(phaseData) {
        let sankey = document.getElementById("sankeyContainer");
        let phaseList = document.getElementById("phaseContentListContainer");

        sankey.style.display = "none";
        let html = "";

        for (i = 0; i < phaseData.length; i++) {
          let div = "<div>" + phaseData[i].BriefTitle[0] + "</div>";
          html += div;
        }
        phaseList.innerHTML = html;
      }

      //Mouse action functions
      let mouseClick = function() {
        console.log("click");
        let phase = d3.select(this).attr("phase");

        if (phase != "Interventional" && phase != "Observational") {
          console.log(phase);
          console.log(phaseData[phase]);
          let currentPhaseData = phaseData[phase];
          buildPhaseContentList(currentPhaseData);
        }
      };

      let mouseHover = function() {
        console.log("hover");
      };

      // add in the links
      var link = svg
        .append("g")
        .selectAll(".link")
        .data(data.links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", sankey.link())
        .attr("phase", function(d) {
          return d.target.name;
        })
        .on("click", mouseClick)
        .on("mouseover", mouseHover)
        .style("fill", "none")
        .style("stroke-width", function(d) {
          return Math.max(1, d.dy);
        });

      // add in the nodes
      var node = svg
        .append("g")
        .selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
          if (d["value"] > 0) {
            return "translate(" + d.x + "," + d.y + ")";
          }
        });

      const nodesToIgnore = [
        "Expanded Access",
        "Observational",
        "Interventional"
      ];
      // add the rectangles for the nodes
      node
        .append("rect")
        .attr("height", function(d) {
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) {
          return (d.color = color(d.name.replace(/ .*/, "")));
        })
        .style("stroke", function(d) {
          return d3.rgb(d.color).darker(2);
        })
        .style("cursor", "pointer")
        .on("click", d => {
          onNodeClick(d).then(res => createPhaseList(res));
        })

        // Add hover text
        .append("title")
        .text(function(d) {
          return (
            d.name + "\n" + "There are " + d.value + " studies in this node"
          );
        });

      async function onNodeClick(d) {
        if (!nodesToIgnore.includes(d["name"]) && d["node"] !== 0) {
          let phaseLists = [];
          return new Promise(resolve => {
            Object.keys(phaseData).forEach(elem => {
              if (elem.includes(d["name"])) {
                phaseLists.push(...phaseData[elem]);
              }
            });
            resolve(phaseLists);
          });
        }
      }

      // add in the title for the nodes
      let rootVal = data["nodes"][0]["value"];
      node
        .append("text")
        .attr("x", -6)
        .attr("y", function(d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) {
          if (d.value !== 0) {
            if (d.node !== 0) {
              let percentage = Math.round((d.value / rootVal) * 100);
              if (percentage === 0) {
                return d.name + ` (< 1%)`;
              } else {
                return d.name + ` (${percentage}%)`;
              }
            } else {
              return d.name + " (100%)";
            }
          }
        })
        .filter(function(d) {
          return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

      var defs = svg.append("defs");
      link.style("stroke", (d, i) => {
        // make unique gradient ids
        const gradientID = `gradient${i}`;
        const startColor = d.source.color;
        const stopColor = d.target.color;
        const x1 = d.source.x;
        const y1 = d.source.y;
        const x2 = d.target.x;
        const y2 = d.target.y;

        const linearGradient = defs
          .append("linearGradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("id", gradientID);

        linearGradient
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", x2)
          .attr("y2", y2);

        linearGradient
          .selectAll("stop")
          .data([
            { offset: "10%", color: startColor },
            { offset: "90%", color: stopColor }
          ])
          .enter()
          .append("stop")
          .attr("offset", d => {
            return d.offset;
          })
          .attr("stop-color", d => {
            return d.color;
          });

        return `url(#${gradientID})`;
      });
    }),
    Promise.resolve()
  );
};
