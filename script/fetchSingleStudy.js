const fetchSingleStudy = (id) => {
    // Show study-div
    let singleStudy = document.getElementById("singleStudy");
    singleStudy.style.display = "inline-block";

    let test = 'https://clinicaltrials.gov/api/query/full_studies?expr=NCT01874691&min_rnk=1&max_rnk=&fmt=json';
    let url = `https://clinicaltrials.gov/api/query/full_studies?expr=${id}&min_rnk=1&max_rnk=&fmt=json`;
    fetch(url)
        .then(rawRes => rawRes.json())
        .then(cleanRes => {
            const study = cleanRes.FullStudiesResponse.FullStudies[0].Study;
            const country = "";
            const description = "";
            console.log(study);
        })
}

const onClickSingleStudy = (e) => {
    const studyTitle = e.target.innerHTML;
    const studyId = e.target.id;
    fetchSingleStudy(studyId);
    console.log(studyTitle, ": ", e.target.id);

}