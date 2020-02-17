test = async () => {
    const fieldValuesUrl = `https://clinicaltrials.gov/api/query/field_values?expr=cancer&field=Phase&fmt=json`;
    const response = await fetch(fieldValuesUrl)
    const rawResult = await response.json();
    const cleanData = rawResult.FieldValuesResponse.FieldValues;
    console.log(cleanData.FieldValues);

    var result = {
        "nodes": [],
        "links": []
    }

    for (key in cleanData) {
        var phase = cleanData[key].FieldValue;
        var studies = cleanData[key].NStudiesFoundWithValue;

        // Creates a new node for each object
        var newNode = {
            "node": key,
            "name": phase
        };

        // Creates a link from the origin "condition" in this case, to the new object.
        var newLink = {
            "source": 0,
            "target": key,
            "value": studies,
        };

        result.nodes.push(newNode);
        result.links.push(newLink);
    }

    console.log(result);
};

test();