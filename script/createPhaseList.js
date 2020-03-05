const createPhaseList = lists => {
  // Remove previous component
  let sankey = document.getElementById("sankeyContainer");
  sankey.style.display = "none";

  let phaseListContainer = document.getElementById("phaseContentListContainer");
  phaseListContainer.style.display = "grid";

  let table = document.getElementById("phaseTable");

  let tableHead = document.getElementById("phaseTableHeader");

  /*   let headRow = tableHead.insertRow();
  let titleHeaderCell = headRow.insertCell(0);
  let dateHeaderCell = headRow.insertCell(1);
  let titleHeader = document.createTextNode("Study title");
  let dateHeader = document.createTextNode("Start date");
  titleHeaderCell.appendChild(titleHeader);
  dateHeaderCell.appendChild(dateHeader); 
 */
  let tableBody = document.getElementById("phaseTableBody");
  console.log(tableBody);

  lists.forEach(element => {
    console.log(element);
    let newRow = tableBody.insertRow();
    let titleCell = newRow.insertCell(0);
    let dateCell = newRow.insertCell(1);

    let title = document.createTextNode(element["BriefTitle"]);
    let date = document.createTextNode(element["StartDate"]);

    titleCell.appendChild(title);
    dateCell.appendChild(date);
  });

  table.appendChild(tableHead);
  table.appendChild(tableBody);
  phaseListContainer.appendChild(table);

  console.log(lists);
};
