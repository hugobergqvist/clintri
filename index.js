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
