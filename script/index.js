
// Handle the search
searchfunction = (e) => {

}

addTreeMap = () => {
    // Add new treemap
    var newTreemap = document.createElement("div");
    newTreemap.classList.add("treemap");
    // ADD TREEMAP: newTreemap.appendChild(treemap);
    var newContent = document.createTextNode("Hi there and greetings!");
    newTreemap.appendChild(newContent);

    // Add Legend
    var newLegend = document.createElement("LEGEND");
    var legendText = document.createTextNode("NewLegend:");  // Make dynamic with incoming data!!
    newLegend.appendChild(legendText);

    // Add Fieldset
    var newFieldset = document.createElement("fieldset");
    newFieldset.appendChild(newLegend);
    newFieldset.appendChild(newTreemap);

    // Add entire new div with all its children
    var newDiv = document.createElement("div");
    newDiv.classList.add("categories");
    newDiv.appendChild(newFieldset);

    // Find the wrapper containing all categories and push the new element
    var wrapperDiv = document.getElementById("categorieContainer");
    wrapperDiv.appendChild(newDiv);
}