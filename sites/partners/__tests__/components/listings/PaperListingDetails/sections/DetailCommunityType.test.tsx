import React from "react"
import { render } from "@testing-library/react"
import { ListingContext } from "../../../../../src/components/listings/ListingContext"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { AuthContext } from "@bloom-housing/shared-helpers"
import DetailCommunityType from "../../../../../src/components/listings/PaperListingDetails/sections/DetailCommunityType"

describe("DetailCommunityType", () => {
  it("should not render when swapCommunityTypesWithPrograms is true", () => {
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
            reservedCommunityTypes: undefined,
          }}
        >
          <DetailCommunityType />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )
    expect(results.queryByText("Community", { exact: false })).toBeFalsy()
  })

  it.todo("should render empty section when no community type was selected", () => {
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
            reservedCommunityTypes: undefined,
          }}
        >
          <DetailCommunityType />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )
  })

  it.todo("should render data when a community type was selected", () => {
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
            reservedCommunityTypes: undefined,
          }}
        >
          <DetailCommunityType />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )
  })
})
