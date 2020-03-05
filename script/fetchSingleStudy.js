const fetchSingleStudy = id => {
  // Show study-div
  let singleStudy = document.getElementById("singleStudy");
  singleStudy.style.display = "inline-block";

  let test = "https://clinicaltrials.gov/api/query/full_studies?expr=NCT01874691&min_rnk=1&max_rnk=&fmt=json";
  let url = `https://clinicaltrials.gov/api/query/full_studies?expr=${id}&min_rnk=1&max_rnk=&fmt=json`;
  fetch(url)
    .then(rawRes => rawRes.json())
    .then(cleanRes => {
      const study = cleanRes.FullStudiesResponse.FullStudies[0].Study;
      console.log(study);
      const studyDecription = study.ProtocolSection.DescriptionModule.BriefSummary;
      const studyTitle = study.ProtocolSection.IdentificationModule.BriefTitle;
      const enrollmentCount = study.ProtocolSection.DesignModule.EnrollmentInfo.EnrollmentCount;
      const gender = study.ProtocolSection.EligibilityModule.Gender;
      const startDate = study.ProtocolSection.StatusModule.StartDateStruct.StartDate;
      let endDate;
      if (Object.keys(study.ProtocolSection.StatusModule).includes("CompletionDateStruct")) {
        endDate = study.ProtocolSection.StatusModule.CompletionDateStruct.CompletionDate;
      } else {
        endDate = "-";
      }
      const organization = study.ProtocolSection.IdentificationModule.Organization.OrgFullName;
      const status = study.ProtocolSection.StatusModule.OverallStatus;

      //console.log("this is description: ", studyDecription);
      //console.log(organization);

      document.getElementById("singleStudyTitle").innerHTML = studyTitle;
      document.getElementById("singleStudyDescription").innerHTML = studyDecription;
      document.getElementById("singleStudyStartDate").innerHTML = startDate;
      document.getElementById("singleStudyEndDate").innerHTML = endDate;
      document.getElementById("singleStudyOrganization").innerHTML = organization;
      document.getElementById("singleStudyGender").innerHTML = gender;
      document.getElementById("singleStudyEnrollmentCount").innerHTML = enrollmentCount;
      document.getElementById("singleStudyStatus").innerHTML = status;
      const studyURL = `https://clinicaltrials.gov/ct2/show/${id}?term=NCT01062347&draw=2&rank=1`;
      document.getElementById("goToWebsiteButton").setAttribute("href", studyURL);
    });
};

const onClickSingleStudy = e => {
  const studyTitle = e.target.innerHTML;
  const studyId = e.target.id;
  fetchSingleStudy(studyId);
  console.log(studyTitle, ": ", e.target.id);
};
