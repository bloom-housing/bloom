import { Views } from "./types"

const views: Views = {
  base: {
    select: [],
    leftJoins: [],
    leftJoinAndSelect: [
      ["application.applicant", "applicant"],
      ["applicant.address", "applicant_address"],
      ["applicant.workAddress", "applicant_workAddress"],
      ["application.alternateAddress", "alternateAddress"],
      ["application.mailingAddress", "mailingAddress"],
      ["application.alternateContact", "alternateContact"],
      ["alternateContact.mailingAddress", "alternateContact_mailingAddress"],
      ["application.accessibility", "accessibility"],
      ["application.demographics", "demographics"],
      ["application.householdMembers", "householdMembers"],
      ["householdMembers.address", "householdMembers_address"],
      ["householdMembers.workAddress", "householdMembers_workAddress"],
      ["application.preferredUnit", "preferredUnit"],
    ],
  },
}

views.partnerList = {
  select: [],
  leftJoins: [
    { join: "application.applicant", alias: "applicant" },
    { join: "applicant.address", alias: "applicant_address" },
    { join: "applicant.workAddress", alias: "applicant_workAddress" },
    { join: "application.alternateAddress", alias: "alternateAddress" },
    { join: "application.mailingAddress", alias: "mailingAddress" },
    { join: "application.alternateContact", alias: "alternateContact" },
    { join: "alternateContact.mailingAddress", alias: "alternateContact_mailingAddress" },
    { join: "application.accessibility", alias: "accessibility" },
    { join: "application.demographics", alias: "demographics" },
    { join: "application.householdMembers", alias: "householdMembers" },
    { join: "householdMembers.address", alias: "householdMembers_address" },
    { join: "householdMembers.workAddress", alias: "householdMembers_workAddress" },
  ],
  leftJoinAndSelect: [
    ["application.applicant", "applicant"],
    ["applicant.address", "applicant_address"],
    ["applicant.workAddress", "applicant_workAddress"],
    ["application.alternateAddress", "alternateAddress"],
    ["application.mailingAddress", "mailingAddress"],
    ["application.alternateContact", "alternateContact"],
    ["alternateContact.mailingAddress", "alternateContact_mailingAddress"],
    ["application.accessibility", "accessibility"],
    ["application.demographics", "demographics"],
    ["application.householdMembers", "householdMembers"],
    ["householdMembers.address", "householdMembers_address"],
    ["householdMembers.workAddress", "householdMembers_workAddress"],
  ],
}

export { views }
