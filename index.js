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
    "https://clinicaltrials.gov/api/query/study_fields?expr=" + keyword + "&fields=StudyType,Phase,BriefTitle&fmt=json";
  fetch(url)
    .then(rawResult => rawResult.json())
    .then(cleanResult => console.log(cleanResult.StudyFieldsResponse))
    .catch(err => {
      console.log("Error fetching categories: ", err);
    });
}