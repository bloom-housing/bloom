import React from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  ListingMultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { render } from "@testing-library/react"
import { ListingContext } from "../../../../../src/components/listings/ListingContext"
import DetailPrograms from "../../../../../src/components/listings/PaperListingDetails/sections/DetailPrograms"

describe("DetailPrograms", () => {
  // default state
  describe("when feature flag swapCommunityTypesWithPrograms is false", () => {
    it("should show programs section copy as programs", () => {
      const programs: ListingMultiselectQuestion[] = [
        {
          multiselectQuestions: {
            id: "programId",
            createdAt: new Date(),
            updatedAt: new Date(),
            text: "Program 1",
            applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
            jurisdictions: undefined,
          },
          ordinal: 1,
        },
      ]
      const results = render(
        <AuthContext.Provider
          value={{
            doJurisdictionsHaveFeatureFlagOn: () => {
              return false
            },
          }}
        >
          <ListingContext.Provider
            value={{
              ...listing,
              listingMultiselectQuestions: programs,
            }}
          >
            <DetailPrograms />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )

      expect(results.getByText("Housing Programs")).toBeInTheDocument()
      expect(results.getByText("Active Programs")).toBeInTheDocument()
      expect(results.getByText("Program 1")).toBeInTheDocument()
      expect(results.queryByText("Community", { exact: false })).toBeFalsy()
    })
  })

  describe("when feature flag swapCommunityTypesWithPrograms is true", () => {
    it("should show programs section copy as community types", () => {
      const programs: ListingMultiselectQuestion[] = [
        {
          multiselectQuestions: {
            id: "communityId",
            createdAt: new Date(),
            updatedAt: new Date(),
            text: "Community 1",
            applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
            jurisdictions: undefined,
          },
          ordinal: 1,
        },
      ]
      const results = render(
        <AuthContext.Provider
          value={{
            doJurisdictionsHaveFeatureFlagOn: () => {
              return true
            },
          }}
        >
          <ListingContext.Provider
            value={{
              ...listing,
              listingMultiselectQuestions: programs,
            }}
          >
            <DetailPrograms />
          </ListingContext.Provider>
        </AuthContext.Provider>
      )

      expect(results.getByText("Community Types")).toBeInTheDocument()
      expect(results.getByText("Active Community Types")).toBeInTheDocument()
      expect(results.getByText("Community 1")).toBeInTheDocument()
      expect(results.queryByText("Program", { exact: false })).toBeFalsy()
    })
  })
})
