const createPhaseList = (lists, genderFilter = "All", minimumAgeFilter = 0, maximumAgeFilter = 100, enrollmentCountFilter = 0) => {
  // Remove previous component

  let sankey = document.getElementById("sankeyContainer");
  sankey.style.display = "none";

  let phaseListContainer = document.getElementById("phaseContentListContainer");

  document.getElementById("phaseTableBody").innerHTML = "";

  phaseListContainer.style.display = "inline-block";

  const firstStudyInListID = lists[0].NCTId[0];
  //console.log("this is lists[0]", lists[0].NCTId[0]);
  fetchSingleStudy(firstStudyInListID);

  let table = document.getElementById("phaseTable");

  let tableHead = document.getElementById("phaseTableHeader");

  var filteredList = [];
  lists.forEach(element => {
    var MinAge = element.MinimumAge[0];
    try {
      var TempMinAge = MinAge.split(" ");
      if (TempMinAge[1] == "Months") {
        MinAge = parseInt(TempMinAge[0]) / 12;
      } else {
        MinAge = parseInt(TempMinAge[0]);
      }
    } catch {
      MinAge = 0;
    }
    var MaxAge = element.MaximumAge[0];
    try {
      var TempMaxAge = MaxAge.split(" ");
      if (TempMaxAge[1] == "Months") {
        MaxAge = parseInt(TempMaxAge[0]) / 12;
      } else {
        MaxAge = parseInt(TempMaxAge[0]);
      }
    } catch {
      MaxAge = 100;
    }
    try {
      var enrollCounter = parseInt(element.enrollmentCount);
    } catch {
      enrollCounter = 0;
    }
    if (element.Gender == genderFilter || genderFilter == "None") {
      if (minimumAgeFilter <= MinAge || minimumAgeFilter == 0 || MinAge == 0) {
        if (maximumAgeFilter >= MaxAge || maximumAgeFilter == 100 || MaxAge == 100) {
          if (enrollmentCountFilter >= enrollCounter || enrollmentCountFilter == 0) {
            filteredList.push(element);
          }
        }
      }
    }
  });

  let tableBody = document.getElementById("phaseTableBody");
  filteredList.forEach(element => {
    //console.log(element);
    let newRow = tableBody.insertRow();
    let titleCell = newRow.insertCell(0);
    let dateCell = newRow.insertCell(1);

    let title = document.createTextNode(element["BriefTitle"]);
    let date = document.createTextNode(element["StartDate"]);
    let NCTId = element["NCTId"];
    // console.log(NCTId)

    newRow.setAttribute("class", "studylistItem");
    titleCell.setAttribute("class", "studylistStudyTitle");
    titleCell.setAttribute("id", NCTId); // Funkar inte riktigt?

    titleCell.onclick = function (e) {
      onClickSingleStudy(e);
    };

    titleCell.appendChild(title);
    dateCell.appendChild(date);
  });

  table.appendChild(tableHead);
  table.appendChild(tableBody);
  phaseListContainer.appendChild(table);

  //console.log(lists);
};
