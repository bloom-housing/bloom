import { createContext } from "react"
import ApplicationConductor from "./ApplicationConductor"
import { blankApplication } from "@bloom-housing/ui-components"
import { Listing } from "@bloom-housing/backend-core/types"

export const retrieveApplicationConfig = () => {
  // Note: this whole function will eventually be replaced with one that reads this from the backend.
  return {
    sections: ["you", "household", "income", "preferences", "review"],
    languages: ["en", "es", "zh", "vi"],
    steps: [
      {
        name: "chooseLanguage",
      },
      {
        name: "whatToExpect",
      },
      {
        name: "autofill",
      },
      {
        name: "primaryApplicantName",
      },
      {
        name: "primaryApplicantAddress",
      },
      {
        name: "alternateContactType",
      },
      {
        name: "alternateContactName",
      },
      {
        name: "alternateContactInfo",
      },
      {
        name: "liveAlone",
      },
      {
        name: "householdMemberInfo",
      },
      {
        name: "addMembers",
      },
      {
        name: "preferredUnitSize",
      },
      {
        name: "adaHouseholdMembers",
      },
      {
        name: "vouchersSubsidies",
      },
      {
        name: "income",
      },
      {
        name: "preferencesAll",
      },
      {
        name: "generalPool",
      },
      {
        name: "demographics",
      },
      {
        name: "summary",
      },
      {
        name: "terms",
      },
    ],
  }
}

export const AppSubmissionContext = createContext({
  conductor: {} as ApplicationConductor,
  application: blankApplication(),
  listing: null as Listing,
  /* eslint-disable */
  syncApplication: (data) => {},
  syncListing: (data) => {},
})
