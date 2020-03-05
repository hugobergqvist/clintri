const createPhaseList = lists => {
  // Remove previous component
  let sankey = document.getElementById("sankeyContainer");
  sankey.style.display = "none";

  let phaseListContainer = document.getElementById("phaseContentListContainer");
  phaseListContainer.style.display = "grid";

  let table = document.createElement("table");
  table.setAttribute("id", "phaseTable");

  let tableHead = document.createElement("thead");
  tableHead.setAttribute("id", "phaseTableHeader");

  let headRow = tableHead.insertRow();
  let titleHeaderCell = headRow.insertCell(0);
  let dateHeaderCell = headRow.insertCell(1);
  let titleHeader = document.createTextNode("Study title");
  let dateHeader = document.createTextNode("Start date");
  titleHeaderCell.appendChild(titleHeader);
  dateHeaderCell.appendChild(dateHeader);

  let tableBody = document.createElement("tbody");
  tableBody.setAttribute("id", "phaseTableBody");

  lists.forEach(element => {
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

const alphabethicalSort = arr => {
  // sort() returns the sorted array.
  arr.sort(function(a, b) {
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

const dateSort = arr => {
  arr.sort(function(a, b) {
    return new Date(b.StartDate) - new Date(a.StartDate);
  });
  return arr;
};

const stringSearch = (arr, keyword) => {
  newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].BriefTitle[0].includes(keyword)) {
      //check if the current study title have the keywords
      newArr.push(arr[i]);
    }
  }
  return newArr;
};
