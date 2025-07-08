import {
  FeatureFlagEnum,
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { jurisdiction, listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { cleanup } from "@testing-library/react"
import { getEligibilitySections } from "../../../src/components/listing/ListingViewSeedsHelpers"

afterEach(cleanup)

describe("ListingViewSeedsHelpers", () => {
  describe("getFilteredMultiselectQuestions", () => {
    it.todo("tests")
  })
  describe("getMultiselectQuestionData", () => {
    it.todo("tests")
  })
  describe("hasMethod", () => {
    it.todo("tests")
  })
  describe("getMethod", () => {
    it.todo("tests")
  })
  describe("getPaperApplications", () => {
    it.todo("tests")
  })
  describe("getOnlineApplicationURL", () => {
    it.todo("tests")
  })
  describe("getHasNonReferralMethods", () => {
    it.todo("tests")
  })
  describe("getAccessibilityFeatures", () => {
    it.todo("tests")
  })
  describe("getUtilitiesIncluded", () => {
    it.todo("tests")
  })
  describe("getFeatures", () => {
    it.todo("tests")
  })
  describe("getAmiValues", () => {
    it.todo("tests")
  })
  describe("getHmiData", () => {
    it.todo("tests")
  })
  describe("getAddress", () => {
    it.todo("tests")
  })
  describe("getReservedTitle", () => {
    it.todo("tests")
  })
  describe("getDateString", () => {
    it.todo("tests")
  })
  describe("getBuildingSelectionCriteria", () => {
    it.todo("tests")
  })
  describe("getEligibilitySections", () => {
    let minimalEligibilitySectionsListing: Listing

    beforeAll(() => {
      //HMI and Occupancy are always returned in the eligibility sections regardless
      minimalEligibilitySectionsListing = {
        ...listing,
        buildingSelectionCriteria: undefined,
        creditHistory: undefined,
        criminalBackground: undefined,
        listingsBuildingSelectionCriteriaFile: undefined,
        listingMultiselectQuestions: [],
        rentalAssistance: undefined,
        rentalHistory: undefined,
        reservedCommunityTypes: undefined,
      }
    })

    it.todo("tests")

    it("should not return a program section in the list if there are no programs", () => {
      const eligibilitySections = getEligibilitySections(
        jurisdiction,
        minimalEligibilitySectionsListing
      )
      expect(eligibilitySections).not.toContainEqual({
        header: "Housing Programs",
        note: "One or more questions in the application will help to determine whether or not you are eligible for the housing programs listed above. After you have submitted your application, the property manager will ask you to verify your housing program eligibility by providing documentation or another form of verification.",
        subheader:
          "Some or all of the units for this property are reserved for persons who qualify for the particular housing program(s) listed below. You may need to qualify for one of these programs in order to be eligible for a unit at this property.",
        content: expect.anything(),
      })
      expect(eligibilitySections).not.toContainEqual({
        header: "Community Types",
        note: "Affordable housing properties often receive funding to house specific populations, like seniors, residents with disabilities, etc. Properties can serve more than one population. Contact this property if you are unsure if you qualify.",
        subheader: "This program includes opportunities for members of specific communities",
        content: expect.anything(),
      })
    })

    it("should return programs with program copy when swapCommunityTypeWithPrograms is false", () => {
      const eligibilitySections = getEligibilitySections(
        {
          ...jurisdiction,
          featureFlags: [
            {
              name: FeatureFlagEnum.swapCommunityTypeWithPrograms,
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              active: false,
              description: "",
              jurisdictions: [],
            },
          ],
        },
        {
          ...minimalEligibilitySectionsListing,
          listingMultiselectQuestions: [
            {
              ordinal: 1,
              multiselectQuestions: {
                id: "id",
                createdAt: new Date(),
                updatedAt: new Date(),
                text: "Program 1",
                jurisdictions: [],
                applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
              },
            },
          ],
        }
      )

      expect(eligibilitySections).toContainEqual({
        header: "Housing Programs",
        note: "One or more questions in the application will help to determine whether or not you are eligible for the housing programs listed above. After you have submitted your application, the property manager will ask you to verify your housing program eligibility by providing documentation or another form of verification.",
        subheader:
          "Some or all of the units for this property are reserved for persons who qualify for the particular housing program(s) listed below. You may need to qualify for one of these programs in order to be eligible for a unit at this property.",
        content: expect.anything(),
      })
    })

    it("should return programs with community type copy when swapCommunityTypeWithPrograms is true", () => {
      const eligibilitySections = getEligibilitySections(
        {
          ...jurisdiction,
          featureFlags: [
            {
              name: FeatureFlagEnum.swapCommunityTypeWithPrograms,
              id: "id",
              createdAt: new Date(),
              updatedAt: new Date(),
              active: true,
              description: "",
              jurisdictions: [],
            },
          ],
        },
        {
          ...minimalEligibilitySectionsListing,
          listingMultiselectQuestions: [
            {
              ordinal: 1,
              multiselectQuestions: {
                id: "id",
                createdAt: new Date(),
                updatedAt: new Date(),
                text: "Community 1",
                jurisdictions: [],
                applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
              },
            },
          ],
        }
      )

      expect(eligibilitySections).toContainEqual({
        header: "Community Types",
        note: "Affordable housing properties often receive funding to house specific populations, like seniors, residents with disabilities, etc. Properties can serve more than one population. Contact this property if you are unsure if you qualify.",
        subheader: "This program includes opportunities for members of specific communities",
        content: expect.anything(),
      })
    })
    it("should return nothing if no data", () => {
      const eligibilitySections = getEligibilitySections(jurisdiction, {
        ...listing,
        units: null,
        reservedCommunityTypes: null,
        listingMultiselectQuestions: [],
        creditHistory: null,
        rentalHistory: null,
        buildingSelectionCriteria: null,
        rentalAssistance: null,
        criminalBackground: null,
      })
      expect(eligibilitySections).toEqual([])
    })
  })
  describe("getAdditionalInformation", () => {
    it.todo("tests")
  })
})
