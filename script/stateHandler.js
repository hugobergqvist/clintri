stateHandler = state => {
    //Accepts strings "loading" and "loaded"

    let loaderDiv = document.getElementById("loader");
    let loaderCounter = document.getElementById("loaderCounter");
    let errorMessageDiv = document.getElementById("errorMessage");
    let treeMapDiv = document.getElementById("treeMapContainer");
    let sankeyTree = document.getElementById("sankeyContainer");

    //reset loader class
    loaderDiv.classList.remove("hideLoader")
    loaderDiv.classList.add("loader")

    if (state == "loading") {
        console.log("loading");
        if (getCurrentPage() == "ListPage" || getCurrentPage() == "SankeyPage") {
            loaderCounter.classList.add("hideLoader")
        }
        loaderDiv.classList.remove("hideLoader");
        if (!errorMessageDiv.classList.contains("hideMessage")) {
            errorMessageDiv.classList.add("hideMessage");
        }

        treeMapDiv.style.display = "none";
    }

    if (state == "loaded") {

        console.log("loaded");

        loaderDiv.classList.add("hideLoader");

        if (!errorMessageDiv.classList.contains("hideMessage")) {
            errorMessageDiv.classList.add("hideMessage");
        }
        //treeMapDiv.style.display = "block";
    }

    if (state == "error") {
        loaderDiv.classList.add("hideLoader");

        const existing_element = document.querySelector("#sankeyContainer");
        const child = existing_element.firstElementChild;
        if (child) {
            existing_element.removeChild(child);
        }

        const singleStudy = document.getElementById("singleStudy");
        const phaseContentListContainer = document.getElementById(
            "phaseContentListContainer"
        );
        singleStudy.style.display = "none";
        phaseContentListContainer.style.display = "none";

        const breadcrumbSankey = document.getElementById("breadcrumbSankey");
        const breadcrumbList = document.getElementById("breadcrumbList");

        if (!breadcrumbList.classList.contains("hideBreadcrumb")) {
            breadcrumbList.classList.add("hideBreadcrumb");
        }
        if (!breadcrumbSankey.classList.contains("hideBreadcrumb")) {
            breadcrumbSankey.classList.add("hideBreadcrumb");
        }

        errorMessageDiv.classList.remove("hideMessage");
        console.log("We got an error when fetching from API");
    } else {
        //loaderDiv.classList.add("hideLoader");
        //console.log("ERROR, stateHandler error")
    }
};