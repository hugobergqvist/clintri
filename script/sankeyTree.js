buildSankeyTree = (data, phaseData) => {
  return (
    new Promise(function (resolve, reject) {
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

      console.log("phaseData in sankeyTree: ", phaseData);

      let phase4 = phaseData["Phase 4"];
      let phase41 = [...phase4];
      let phase42 = [...phase4];
      let phase43 = [...phase4];

      console.log("this is phase 4:", phase4);

      alphabethicalSort = arr => {
        // sort() returns the sorted array.
        arr.sort(function (a, b) {
          var titleA = a.BriefTitle;
          var titleB = b.BriefTitle;
          if (titleA < titleB) {
            //If compareFunction(a, b) returns less than 0, sort a to an index lower than b (i.e. a comes first).
            return -1;
          }
          if (titleA > titleB) {
            //If compareFunction(a, b) returns greater than 0, sort b to an index lower than a (i.e. b comes first).
            return 1;
          }
          //If compareFunction(a, b) returns 0, leave a and b unchanged with respect to each other, but sorted with respect to all different elements.
          return 0;
        });

        return arr;
      };

      console.log("this is sorted Alphabetically: ", alphabethicalSort(phase41));
      //console.log("this is sorted Alphabetically reverse: ", alphabethicalSort(phase4).reverse());

      dateSort = arr => {
        arr.sort(function (a, b) {
          return new Date(b.StartDate) - new Date(a.StartDate);
        });
        return arr;
      };

      console.log("this is sorted by Date", dateSort(phase42));

      stringSearch = (arr, keyword) => {
        newArr = [];
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].BriefTitle[0].includes(keyword)) {
            //check if the current study title have the keywords
            newArr.push(arr[i]);
          }
        }
        return newArr;
      };

      console.log("This is String Search with keyword 'Pretreatment'", stringSearch(phase43, "Pretreatment"));

      // This updates the breadcrumbnavigation, sankey-breadcrumb
      const condition = getCondition();
      document.getElementById("breadcrumbSankey").innerHTML = condition;
      const breadcrumbSankey = document.getElementById("breadcrumbSankey");
      breadcrumbSankey.classList.remove("hideBreadcrumb");

      const breadcrumbList = document.getElementById("breadcrumbList");
      const breadcrumbStudy = document.getElementById("breadcrumbStudy");

      if (!breadcrumbList.classList.contains("hideBreadcrumb")) {
        breadcrumbList.classList.add("hideBreadcrumb");
      } else if (!breadcrumbStudy.classList.contains("hideBreadcrumb")) {
        breadcrumbStudy.classList.add("hideBreadcrumb");
      }


      //console.log("data in sankeyTree.js: ", data);

      // Constructs a new Sankey generator with the default settings.
      sankey
        .nodes(data.nodes)
        .links(data.links)
        .layout(0);

      // add in the links
      var link = svg
        .append("g")
        .selectAll(".link")
        .data(data.links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", sankey.link())
        .style('fill', 'none')
        .style("stroke-width", function (d) {
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
        .attr("transform", function (d) {
          if (d["value"] > 0) {
            return "translate(" + d.x + "," + d.y + ")";
          }
        })
        .call(
          d3
            .drag()
            .subject(function (d) {
              return d;
            })
            .on("start", function () {
              this.parentNode.appendChild(this);
            })
            .on("drag", dragmove)
        );

      // add the rectangles for the nodes
      node
        .append("rect")
        .attr("height", function (d) {
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
          return (d.color = color(d.name.replace(/ .*/, "")));
        })
        .style("stroke", function (d) {
          return d3.rgb(d.color).darker(2);
        })
        // Add hover text
        .append("title")
        .text(function (d) {
          return d.name + "\n" + "There are " + d.value + " studies in this node";
        });

      // add in the title for the nodes
      let rootVal = data["nodes"][0]["value"];
      node
        .append("text")
        .attr("x", -6)
        .attr("y", function (d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) {
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
        .filter(function (d) {
          return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

      var defs = svg.append("defs");
      link.style('stroke', (d, i) => {

        // make unique gradient ids  
        const gradientID = `gradient${i}`;
        const startColor = d.source.color;
        const stopColor = d.target.color;
        const x1 = d.source.x;
        const y1 = d.source.y;
        const x2 = d.target.x;
        const y2 = d.target.y;

        const linearGradient = defs.append('linearGradient')
          .attr("gradientUnits", "userSpaceOnUse")
          .attr('id', gradientID);

        linearGradient.attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", x2)
          .attr("y2", y2);

        linearGradient.selectAll('stop')
          .data([
            { offset: '10%', color: startColor },
            { offset: '90%', color: stopColor }
          ])
          .enter().append('stop')
          .attr('offset', d => { return d.offset; })
          .attr('stop-color', d => { return d.color; });

        return `url(#${gradientID})`;
      })


      // the function for moving the nodes
      function dragmove(d) {
        d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
        sankey.relayout();
        link.attr("d", sankey.link());
      }
    }),
    Promise.resolve()
  );
};
