import {
  FeatureFlagEnum,
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
  UnitsSummarized,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { jurisdiction, listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { cleanup } from "@testing-library/react"
import {
  getCurrencyFromArgumentString,
  getEligibilitySections,
  getStackedHmiData,
} from "../../../src/components/listing/ListingViewSeedsHelpers"

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
  describe("getCurrencyFromArgumentString", () => {
    it("should return range at end of formatted string", () => {
      expect(getCurrencyFromArgumentString("listings.annualIncome*income:$36,000")).toEqual(
        "$36,000"
      )
      expect(getCurrencyFromArgumentString("listings.monthlyIncome*income:$4,000")).toEqual(
        "$4,000"
      )
      expect(getCurrencyFromArgumentString("listings.annualIncome*income:$60,000-$84,000")).toEqual(
        "$60,000 - $84,000"
      )
    })
  })
  describe("getStackedHmiData", () => {
    it("should return correctly for multiple ami percentages and some ranges", () => {
      expect(
        getStackedHmiData({
          ...listing,
          unitsSummarized: {
            hmi: {
              columns: {
                sizeColumn: "listings.householdSize",
                ami30: "listings.percentAMIUnit*percent:30",
                ami50: "listings.percentAMIUnit*percent:50",
              },
              rows: [
                {
                  sizeColumn: 1,
                  ami30: "listings.annualIncome*income:$36,000-$60,000",
                  ami50: "listings.annualIncome*income:$84,000",
                },
                {
                  sizeColumn: 2,
                  ami30: "listings.annualIncome*income:$48,000-$72,000",
                  ami50: "listings.annualIncome*income:$96,000",
                },
                {
                  sizeColumn: 3,
                  ami30: "listings.annualIncome*income:$60,000-$84,000",
                  ami50: "listings.annualIncome*income:$108,000",
                },
              ],
            },
          } as UnitsSummarized,
        })
      ).toStrictEqual([
        {
          ami30: { cellSubText: "per year", cellText: "$36,000 - $60,000" },
          ami50: { cellSubText: "per year", cellText: "$84,000" },
          sizeColumn: { cellText: 1 },
        },
        {
          ami30: { cellSubText: "per year", cellText: "$48,000 - $72,000" },
          ami50: { cellSubText: "per year", cellText: "$96,000" },
          sizeColumn: { cellText: 2 },
        },
        {
          ami30: { cellSubText: "per year", cellText: "$60,000 - $84,000" },
          ami50: { cellSubText: "per year", cellText: "$108,000" },
          sizeColumn: { cellText: 3 },
        },
      ])
    })

    it("should return correctly for one ami percentage and ranges", () => {
      expect(
        getStackedHmiData({
          ...listing,
          unitsSummarized: {
            hmi: {
              columns: {
                sizeColumn: "listings.householdSize",
                maxIncomeMonth: "listings.maxIncomeMonth",
                maxIncomeYear: "listings.maxIncomeYear",
              },
              rows: [
                {
                  sizeColumn: 1,
                  maxIncomeMonth: "listings.monthlyIncome*income:$3,000-$5,000",
                  maxIncomeYear: "listings.annualIncome*income:$36,000-$60,000",
                },
                {
                  sizeColumn: 2,
                  maxIncomeMonth: "listings.monthlyIncome*income:$4,000-$6,000",
                  maxIncomeYear: "listings.annualIncome*income:$48,000-$72,000",
                },
                {
                  sizeColumn: 3,
                  maxIncomeMonth: "listings.monthlyIncome*income:$5,000-$7,000",
                  maxIncomeYear: "listings.annualIncome*income:$60,000-$84,000",
                },
              ],
            },
          } as UnitsSummarized,
        })
      ).toStrictEqual([
        {
          maxIncomeMonth: { cellSubText: "per month", cellText: "$3,000 - $5,000" },
          maxIncomeYear: { cellSubText: "per year", cellText: "$36,000 - $60,000" },
          sizeColumn: { cellText: 1 },
        },
        {
          maxIncomeMonth: { cellSubText: "per month", cellText: "$4,000 - $6,000" },
          maxIncomeYear: { cellSubText: "per year", cellText: "$48,000 - $72,000" },
          sizeColumn: { cellText: 2 },
        },
        {
          maxIncomeMonth: { cellSubText: "per month", cellText: "$5,000 - $7,000" },
          maxIncomeYear: { cellSubText: "per year", cellText: "$60,000 - $84,000" },
          sizeColumn: { cellText: 3 },
        },
      ])
    })

    it("should return correctly for one ami percentage and no ranges", () => {
      expect(
        getStackedHmiData({
          ...listing,
          unitsSummarized: {
            hmi: {
              columns: {
                sizeColumn: "listings.householdSize",
                maxIncomeMonth: "listings.maxIncomeMonth",
                maxIncomeYear: "listings.maxIncomeYear",
              },
              rows: [
                {
                  sizeColumn: 1,
                  maxIncomeMonth: "listings.monthlyIncome*income:$3,000",
                  maxIncomeYear: "listings.annualIncome*income:$36,000",
                },
                {
                  sizeColumn: 2,
                  maxIncomeMonth: "listings.monthlyIncome*income:$4,000",
                  maxIncomeYear: "listings.annualIncome*income:$48,000",
                },
                {
                  sizeColumn: 3,
                  maxIncomeMonth: "listings.monthlyIncome*income:$5,000",
                  maxIncomeYear: "listings.annualIncome*income:$60,000",
                },
              ],
            },
          } as UnitsSummarized,
        })
      ).toStrictEqual([
        {
          maxIncomeMonth: { cellSubText: "per month", cellText: "$3,000" },
          maxIncomeYear: { cellSubText: "per year", cellText: "$36,000" },
          sizeColumn: { cellText: 1 },
        },
        {
          maxIncomeMonth: { cellSubText: "per month", cellText: "$4,000" },
          maxIncomeYear: { cellSubText: "per year", cellText: "$48,000" },
          sizeColumn: { cellText: 2 },
        },
        {
          maxIncomeMonth: { cellSubText: "per month", cellText: "$5,000" },
          maxIncomeYear: { cellSubText: "per year", cellText: "$60,000" },
          sizeColumn: { cellText: 3 },
        },
      ])
    })

    it("should return correctly for multiple ami percentages and no ranges", () => {
      expect(
        getStackedHmiData({
          ...listing,
          unitsSummarized: {
            hmi: {
              columns: {
                sizeColumn: "listings.householdSize",
                ami30: "listings.percentAMIUnit*percent:30",
                ami60: "listings.percentAMIUnit*percent:60",
              },
              rows: [
                {
                  sizeColumn: 1,
                  ami30: "listings.annualIncome*income:$36,000",
                  ami60: "listings.annualIncome*income:$72,000",
                },
                {
                  sizeColumn: 2,
                  ami30: "listings.annualIncome*income:$48,000",
                  ami60: "listings.annualIncome*income:$84,000",
                },
                {
                  sizeColumn: 3,
                  ami30: "listings.annualIncome*income:$60,000",
                  ami60: "listings.annualIncome*income:$96,000",
                },
              ],
            },
          } as UnitsSummarized,
        })
      ).toStrictEqual([
        {
          ami30: { cellSubText: "per year", cellText: "$36,000" },
          ami60: { cellSubText: "per year", cellText: "$72,000" },
          sizeColumn: { cellText: 1 },
        },
        {
          ami30: { cellSubText: "per year", cellText: "$48,000" },
          ami60: { cellSubText: "per year", cellText: "$84,000" },
          sizeColumn: { cellText: 2 },
        },
        {
          ami30: { cellSubText: "per year", cellText: "$60,000" },
          ami60: { cellSubText: "per year", cellText: "$96,000" },
          sizeColumn: { cellText: 3 },
        },
      ])
    })
  })
  describe("getAdditionalInformation", () => {
    it.todo("tests")
  })
})
