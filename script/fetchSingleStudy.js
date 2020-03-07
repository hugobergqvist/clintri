const fetchSingleStudy = id => {
  // Show study-div
  let singleStudy = document.getElementById("singleStudy");

  let test =
    "https://clinicaltrials.gov/api/query/full_studies?expr=NCT01874691&min_rnk=1&max_rnk=&fmt=json";
  let url = `https://clinicaltrials.gov/api/query/full_studies?expr=${id}&min_rnk=1&max_rnk=&fmt=json`;
  fetch(url)
    .then(rawRes => rawRes.json())
    .then(cleanRes => {
      const study = cleanRes.FullStudiesResponse.FullStudies[0].Study;
      const studyTitle = study.ProtocolSection.IdentificationModule.BriefTitle;
      let endDate;
      let studyDecription;
      let enrollmentCount;
      let startDate;
      let organization;
      let status;
      let gender;
      let minAge;
      let maxAge;
      let AgeSeperator = "";
      let country;
      console.log(study);

      if (
        Object.keys(study.ProtocolSection.DescriptionModule).includes(
          "BriefSummary"
        )
      ) {
        studyDecription = study.ProtocolSection.DescriptionModule.BriefSummary;
      } else {
        studyDecription = "-";
      }

      if (
        Object.keys(study.ProtocolSection.DesignModule.EnrollmentInfo).includes(
          "EnrollmentCount"
        )
      ) {
        enrollmentCount =
          study.ProtocolSection.DesignModule.EnrollmentInfo.EnrollmentCount;
      } else {
        enrollmentCount = "-";
      }

      if (
        Object.keys(study.ProtocolSection.EligibilityModule).includes("Gender")
      ) {
        gender = study.ProtocolSection.EligibilityModule.Gender;
      } else {
        gender = "-";
      }

      if (
        Object.keys(study.ProtocolSection.StatusModule).includes(
          "StartDateStruct"
        )
      ) {
        startDate =
          study.ProtocolSection.StatusModule.StartDateStruct.StartDate;
      } else {
        startDate = "-";
      }

      if (
        Object.keys(study.ProtocolSection.StatusModule).includes(
          "CompletionDateStruct"
        )
      ) {
        endDate =
          study.ProtocolSection.StatusModule.CompletionDateStruct
            .CompletionDate;
      } else {
        endDate = "-";
      }

      if (
        Object.keys(
          study.ProtocolSection.IdentificationModule.Organization
        ).includes("OrgFullName")
      ) {
        organization =
          study.ProtocolSection.IdentificationModule.Organization.OrgFullName;
      } else {
        organization = "-";
      }

      if (
        Object.keys(study.ProtocolSection.StatusModule).includes(
          "OverallStatus"
        )
      ) {
        status = study.ProtocolSection.StatusModule.OverallStatus;
      } else {
        status = "-";
      }

      if (Object.keys(study.ProtocolSection.EligibilityModule).includes("MinimumAge")) {
        minAge = study.ProtocolSection.EligibilityModule.MinimumAge;
      } else {
        minAge = " - ";
      }

      if (Object.keys(study.ProtocolSection.EligibilityModule).includes("MaximumAge")) {
        maxAge = study.ProtocolSection.EligibilityModule.MaximumAge;
      } else {
        maxAge = "+";
      }

      if (Object.keys(study.ProtocolSection.EligibilityModule).includes("MinimumAge") && Object.keys(study.ProtocolSection.EligibilityModule).includes("MaximumAge")) {
        AgeSeperator = " to ";
      }

      if (Object.keys(study.ProtocolSection.ContactsLocationsModule).includes("LocationList")) {
        if (Object.keys(study.ProtocolSection.ContactsLocationsModule.LocationList).includes("Location")) {
          if (Object.keys(study.ProtocolSection.ContactsLocationsModule.LocationList.Location[0]).includes("LocationCountry")) {
            country = study.ProtocolSection.ContactsLocationsModule.LocationList.Location[0].LocationCountry;
          } else {
            country = "-";
          }
        } else {
          country = "-";
        }
      } else {
        country = "-";
      }


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
      document.getElementById("singleStudyAge").innerHTML = minAge + AgeSeperator + maxAge;

      // LÄGG TILL RADEN NEDAN FÖR ATT PUSHA IN COUNTRY. SKAPA EN DIV I SINGLE STUDY SOM INNEHÅLLER COUNTRY
      // document.getElementById("singleStudyCountry").innerHTML = country;
      const studyURL = `https://clinicaltrials.gov/ct2/show/${id}?term=NCT01062347&draw=2&rank=1`;
      document
        .getElementById("goToWebsiteButton")
        .setAttribute("href", studyURL);
    })
    .then(() => {
      singleStudy.style.display = "grid";
    });
};

const onClickSingleStudy = e => {
  const studyTitle = e.target.innerHTML;
  const studyId = e.target.id;
  console.log("this is studyID: ", studyId);
  fetchSingleStudy(studyId);
  console.log(studyTitle, ": ", e.target.id);
};
