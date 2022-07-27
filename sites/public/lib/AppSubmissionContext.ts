import { createContext } from "react"
import ApplicationConductor from "./ApplicationConductor"
import { blankApplication } from "@bloom-housing/shared-helpers"
import { ApplicationSection, Listing } from "@bloom-housing/backend-core/types"

export const retrieveApplicationConfig = (listing: Listing) => {
  // Note: this whole function will eventually be replaced with one that reads this from the backend.
  const config = {
    sections: ["you", "household", "income"],
    languages: ["en", "es", "zh", "vi", "tl"],
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
    ],
  }

  // conditionally add programs
  if (
    listing.listingMultiselectQuestions.filter(
      (question) => question.multiselectQuestion.applicationSection === ApplicationSection.programs
    ).length
  ) {
    config.sections.push("programs")
    config.steps.push(
      {
        name: "householdChanges",
      },
      {
        name: "householdStudent",
      },
      {
        name: "programs",
      }
    )
  }

  // conditionally add preferences
  if (
    listing.listingMultiselectQuestions.filter(
      (question) =>
        question.multiselectQuestion.applicationSection === ApplicationSection.preferences
    ).length
  ) {
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
  application: { ...blankApplication },
  listing: null as Listing,
  /* eslint-disable */
  syncApplication: (data) => {},
  syncListing: (data) => {},
})
