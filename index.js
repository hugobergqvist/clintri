getCategories = () => {
  let url =
    "https://clinicaltrials.gov/api/query/field_values?expr=&field=ConditionBrowseBranchName&fmt=json";
  fetch(url)
    .then(rawResult => rawResult.json())
    .then(cleanResult => console.log(cleanResult.FieldValuesResponse))
    .catch(err => {
      console.log("Error fetching categories: ", err);
    });
};

getStudyTypeFromKeyword = (keyword = "cancer") => {
  let url =
    "https://clinicaltrials.gov/api/query/study_fields?expr=" +
    keyword +
    "&fields=StudyType,Phase,BriefTitle&fmt=json";
  fetch(url)
    .then(rawResult => rawResult.json())
    .then(cleanResult => console.log(cleanResult.StudyFieldsResponse))
    .catch(err => {
      console.log("Error fetching categories: ", err);
    });
};

getPhaseDistribution = () => {
  let condition = document.getElementById("phase").value;
  const phaseTable = document
    .getElementById("phaseTable")
    .getElementsByTagName("tbody")[0];

  var new_tbody = document.createElement("tbody");

  const fieldValuesUrl = `https://clinicaltrials.gov/api/query/field_values?expr=${condition}&field=Phase&fmt=json`;
  fetch(fieldValuesUrl)
    .then(rawResult => rawResult.json())
    .then(cleanResult => {
      console.log(cleanResult.FieldValuesResponse);
      document.getElementById(
        "condition"
      ).innerHTML = `Searched condition: ${cleanResult.FieldValuesResponse.Expression}`;
      document.getElementById(
        "studiesTotal"
      ).innerHTML = `Studies total: ${cleanResult.FieldValuesResponse.NStudiesUsed}`;
      cleanResult.FieldValuesResponse.FieldValues.map(elem => {
        var newRow = new_tbody.insertRow();
        var phaseCell = newRow.insertCell(0);
        var studiesCell = newRow.insertCell(1);

        var phase = document.createTextNode(elem.FieldValue);
        var studies = document.createTextNode(elem.NStudiesFoundWithValue);

        phaseCell.appendChild(phase);
        studiesCell.appendChild(studies);
      });
      phaseTable.parentNode.replaceChild(new_tbody, phaseTable);
    })
    .catch(err => {
      console.log("Error fetching phases: ", err);
    });
};
