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

      // This updates the breadcrumbnavigation, sankey-breadcrumb
      const condition = getCondition();
      const breadcrumbSankey = document.getElementById("breadcrumbSankey");
      breadcrumbSankey.innerHTML = condition;
      breadcrumbSankey.classList.remove("hideBreadcrumb");

      const breadcrumbList = document.getElementById("breadcrumbList");
      // const breadcrumbStudy = document.getElementById("breadcrumbStudy");

      if (!breadcrumbList.classList.contains("hideBreadcrumb")) {
        breadcrumbList.classList.add("hideBreadcrumb");
      }
      // else if (!breadcrumbStudy.classList.contains("hideBreadcrumb")) {
      //   breadcrumbStudy.classList.add("hideBreadcrumb");
      // }

      //console.log("data in sankeyTree.js: ", data);

      // Constructs a new Sankey generator with the default settings.
      sankey
        .nodes(data.nodes)
        .links(data.links)
        .layout(0);

      const nodesToIgnore = [
        "Expanded Access",
        "Observational",
        "Interventional"
      ];

      //Mouse action functions
      async function mouseClick(d) {
        const studyType = d["source"]["name"];
        const phaseName = d["target"]["name"];
        const breadcrumb = studyType + " - " + phaseName;
        const breadcrumbList = document.getElementById("breadcrumbList");
        breadcrumbList.innerHTML = breadcrumb;
        breadcrumbList.classList.remove("hideBreadcrumb");

        if (!nodesToIgnore.includes(d["target"]["name"]) && d["node"] !== 0) {
          let phaseLists = [];
          return new Promise(resolve => {
            Object.keys(phaseData).forEach(elem => {
              if (elem.includes(d["target"]["name"])) {
                phaseLists.push(...phaseData[elem]);
              }
            });
            resolve(phaseLists);
          });
        }
      }

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
        .on("click", d => {
          if (d["source"]["node"] !== 0) {
            mouseClick(d).then(res => createPhaseList(res));
          }
        })
        .style("fill", "none")
        .style("cursor", "pointer")
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
        .call(
          d3
            .drag()
            .subject(function(d) {
              return d;
            })
            .on("start", function() {
              this.parentNode.appendChild(this);
            })
            .on("drag", dragmove)
        )

        // Add hover text
        .append("title")
        .text(function(d) {
          return (
            d.name + "\n" + "There are " + d.value + " studies in this node"
          );
        });

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
      // the function for moving the nodes
      function dragmove(d) {
        d3.select(this).attr(
          "transform",
          "translate(" +
            d.x +
            "," +
            (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) +
            ")"
        );
        sankey.relayout();
        link.attr("d", sankey.link());
      }
    }),
    Promise.resolve()
  );
};
