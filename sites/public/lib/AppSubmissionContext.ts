import { createContext } from "react"
import ApplicationConductor from "./ApplicationConductor"
import { blankApplication } from "@bloom-housing/ui-components"
import { Listing } from "@bloom-housing/backend-core/types"

export const retrieveApplicationConfig = (listing: Listing) => {
  // Note: this whole function will eventually be replaced with one that reads this from the backend.
  const config = {
    sections: ["you", "household", "income"],
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
        name: "householdChanges",
      },
      {
        name: "householdStudent",
      },
      {
        name: "vouchersSubsidies",
      },
      {
        name: "income",
      },
    ],
  }

  // conditionally add preferences
  if (listing.listingPreferences.length) {
    config.sections.push("preferences")
    config.steps.push(
      {
        name: "preferencesAll",
      },
      {
        name: "generalPool",
      }
    )
  }

  // push rest onto sections and steps
  config.sections.push("review")

  config.steps.push(
    {
      name: "demographics",
    },
    {
      name: "summary",
    },
    {
      name: "terms",
    }
  )

  return config
}

export const AppSubmissionContext = createContext({
  conductor: {} as ApplicationConductor,
  application: blankApplication(),
  listing: null as Listing,
  /* eslint-disable */
  syncApplication: (data) => {},
  syncListing: (data) => {},
})
