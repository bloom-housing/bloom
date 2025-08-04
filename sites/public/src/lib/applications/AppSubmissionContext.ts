import { createContext } from "react"
import ApplicationConductor from "./ApplicationConductor"
import { blankApplication, listingSectionQuestions } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
  FeatureFlag,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { isFeatureFlagOn } from "../helpers"

export const retrieveApplicationConfig = (listing: Listing, featureFlags: FeatureFlag[]) => {
  // Note: this whole function will eventually be replaced with one that reads this from the backend.
  const config = {
    sections: ["you", "household"],
    steps: [
      {
        name: "chooseLanguage",
      },
    ],
  }

  // conditionally add community disclaimer
  if (listing?.includeCommunityDisclaimer) {
    config.steps.push({
      name: "communityDisclaimer",
    })
  }

  // Continue with rest of the steps
  config.steps.push(
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
    }
  )
  // conditionally add programs
  if (
    listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.programs)?.length
  ) {
    const swapCommunityTypeWithPrograms = isFeatureFlagOn(
      { featureFlags: featureFlags },
      FeatureFlagEnum.swapCommunityTypeWithPrograms
    )
    const stepName = swapCommunityTypeWithPrograms ? "communityTypes" : "programs"
    config.sections.push(stepName)
    config.steps.push({
      name: stepName,
    })
  }

  config.sections.push("income")

  config.steps.push(
    {
      name: "vouchersSubsidies",
    },
    {
      name: "income",
    }
  )

  // conditionally add preferences
  if (
    listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.preferences)?.length
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
  application: JSON.parse(JSON.stringify(blankApplication)),
  listing: null as Listing,
  /* eslint-disable */
  syncApplication: (data) => {},
  syncListing: (data) => {},
})
