modifyIncomingData = async () => { // Perhaps change so incoming data is cleanresults so we don't can API if not necessary!
    var NewJsonObject = {
        "name": "Category",
        "children": []
    };

    let url = "https://clinicaltrials.gov/api/query/field_values?expr=&field=ConditionBrowseBranchName&fmt=json";
    const response = await fetch(url)
    const rawResult = await response.json();
    const CleanData = rawResult.FieldValuesResponse.FieldValues;

    for (key in CleanData) {
        if (key != 0) {
            var newObject = {
                "name": CleanData[key].FieldValue,
                "value": CleanData[key].NStudiesWithValue
            }
            NewJsonObject.children.push(newObject);

            // console.log(CleanData[key].FieldValue);
            // console.log(CleanData[key].NStudiesWithValue);
        }
    }

    console.log(NewJsonObject);
    return NewJsonObject;

    // .then(rawResult => rawResult.json())
    // .then(cleanResult => {
    //     console.log("Trying to cleandata: ");
    //     console.log(cleanResult.FieldValuesResponse.FieldValues);
    //     var CleanData = cleanResult.FieldValuesResponse.FieldValues;
    //     console.log(NewJsonObject);
    // }).then(() => {
    //     return NewJsonObject;
    // })
    // .catch(err => {
    //     console.log("Error fetching categories: ", err);
    // });
};