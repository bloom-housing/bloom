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
  leftJoins: [],
  leftJoinAndSelect: [
    ["application.applicant", "applicant"],
    ["application.householdMembers", "householdMembers"],
    ["application.accessibility", "accessibility"],
    ["applicant.address", "applicant_address"],
    ["application.mailingAddress", "mailingAddress"],
    ["applicant.workAddress", "applicant_workAddress"],
    ["application.alternateContact", "alternateContact"],
    ["application.alternateAddress", "alternateAddress"],
    ["alternateContact.mailingAddress", "alternateContact_mailingAddress"],
  ],
}

export { views }
