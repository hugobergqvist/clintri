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
  megaFetch(condition, 1, 1000, [], callback);
  /*
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
    .catch(err => console.log("error fetching sankey tree data: ", err));*/
};

const formatData = (condition, data, callback) => {
  var formattedObj = {
    nodes: [
      { node: 0, name: condition, id: "Root" },
      { node: 1, name: "None" },
      { node: 2, name: "Final" }
    ],
    links: []
  };
  var nodeObj = { Root: 0, None: 1, Final: 2 };
  var counterObj = {};
  var studyCounter = 0;
  var nodeCounter = 3;

  data.map(object => {
    if (!Object.keys(nodeObj).includes(object.StudyType[0])) {
      nodeObj[object.StudyType[0]] = nodeCounter;
      formattedObj["nodes"].push({
        node: nodeCounter,
        name: object.StudyType[0]
      });
      nodeCounter += 1;
    }

    if (
      !Object.keys(nodeObj).includes(object.Phase[0]) &&
      object.Phase[0] !== undefined
    ) {
      nodeObj[object.Phase[0]] = nodeCounter;
      formattedObj["nodes"].push({
        node: nodeCounter,
        name: object.Phase[0]
      });
      nodeCounter += 1;
    }
    if (Object.keys(counterObj).includes(object.StudyType[0])) {
      var phase = object.Phase[0] != undefined ? object.Phase[0] : "None";
      if (counterObj[object.StudyType][phase]) {
        counterObj[object.StudyType][phase] += 1;
      } else {
        counterObj[object.StudyType][phase] = 1;
      }
    } else {
      var phase = object.Phase[0] != undefined ? object.Phase[0] : "None";
      counterObj[object.StudyType] = { [phase]: 1 };
    }
    if (studyCounter < 60) {
      if (object.Phase[0] === undefined) {
        formattedObj["links"].push({
          source: nodeObj["None"],
          target: 2,
          value: 20
        });
      } else {
        formattedObj["links"].push({
          source: nodeObj[object.Phase[0]],
          target: 2,
          value: 20
        });
      }
      studyCounter += 1;
    }
  });

  Object.entries(counterObj).map(elem => {
    var total = 0;
    Object.entries(elem[1]).map(innerElem => {
      total += innerElem[1];
      formattedObj["links"].push({
        source: nodeObj[elem[0]],
        target: nodeObj[innerElem[0]],
        value: innerElem[1]
      });
    });

    formattedObj["links"].push({
      source: 0,
      target: nodeObj[elem[0]],
      value: total
    });
  });

  callback(formattedObj);
};

const megaFetch = (
 
  condition = "heart attack",
  min = 1,
  max = 1000,
  totalResult = [],
  callback
) => {

  var currentRes = totalResult;
  let megaUrl = `https://clinicaltrials.gov/api/query/study_fields?expr=${condition}&fields=BriefTitle%2CStudyType%2CPhase&min_rnk=${min}&max_rnk=${max}&fmt=json`;
  fetch(megaUrl)
    .then(rawRes => rawRes.json())
    .then(cleanRes => {
      currentRes.push(...cleanRes.StudyFieldsResponse.StudyFields);
      if (cleanRes.StudyFieldsResponse.NStudiesReturned === 1000) {
        megaFetch(condition, min + 1000, max + 1000, currentRes, callback);
      } else {
        formatData(condition, currentRes, callback);
      }
    })
    .catch(err => console.log(err));
};
