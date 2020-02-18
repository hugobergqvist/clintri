oldHandleSankeyTreeData = async condition => {
  const fieldValuesUrl = `https://clinicaltrials.gov/api/query/field_values?expr=${condition}&field=Phase&fmt=json`;
  const response = await fetch(fieldValuesUrl);
  const rawResult = await response.json();
  const cleanData = rawResult.FieldValuesResponse.FieldValues;

  var result = {
    nodes: [],
    links: []
  };

  // Add condition as first node
  const rootNode = {
    node: 0,
    name: condition
  };
  result.nodes.push(rootNode);

  for (key in cleanData) {
    var phase = cleanData[key].FieldValue;
    var studies = cleanData[key].NStudiesFoundWithValue;

    // Make key to int so we can increase the key by one, and back!
    var temp = parseInt(key) + 1;

    // Creates a new node for each object
    var newNode = {
      node: temp,
      name: phase
    };

    // Creates a link from the origin "condition" in this case, to the new object.
    var newLink = {
      source: 0,
      target: temp,
      value: studies
    };

    result.nodes.push(newNode);
    result.links.push(newLink);
  }

  // console.log(result);
  return result;
};

handleSankeyTreeData = (condition, callback) => {
  var result = {
    nodes: [],
    links: []
  };

  var counter = 1;

  let url = `https://clinicaltrials.gov/api/query/field_values?expr=${condition}&field=Phase&fmt=json`;

  fetch(url)
    .then(rawRes => rawRes.json())
    .then(cleanRes => {
      result["nodes"].push({
        node: 0,
        name: condition
      });
      cleanRes.FieldValuesResponse.FieldValues.map(element => {
        result["nodes"].push({
          node: counter,
          name: element.FieldValue
        });
        result["links"].push({
          source: 0,
          target: counter,
          value: element.NStudiesFoundWithValue
        });
        counter += 1;
      });
    })
    .then(() => {
      callback(result);
    })
    .catch(err => console.log("error fetching sankey tree data: ", err));
};
