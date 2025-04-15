import React from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { render } from "@testing-library/react"
import { ListingContext } from "../../../../../src/components/listings/ListingContext"
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

  it("should render empty section when no community type was selected", () => {
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
            reservedCommunityTypes: undefined,
          }}
        >
          <DetailCommunityType />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(results.getByText("Community Type")).toBeInTheDocument()
    expect(results.getByText("Reserved Community Type")).toBeInTheDocument()
    expect(results.getByText("Reserved Community Description")).toBeInTheDocument()
    expect(
      results.getByText(
        "Do you want to include a community type disclaimer as the first page of the application?"
      )
    ).toBeInTheDocument()
  })

  it("should render data when a community type was selected", () => {
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
            reservedCommunityTypes: {
              id: "id",
              name: "veteran",
            },
            reservedCommunityDescription: "For folks who serve in the armed forces",
          }}
        >
          <DetailCommunityType />
        </ListingContext.Provider>
      </AuthContext.Provider>
    )

    expect(results.getByText("Community Type")).toBeInTheDocument()
    expect(results.getByText("Reserved Community Type")).toBeInTheDocument()
    expect(results.getByText("Veteran")).toBeInTheDocument()
    expect(results.getByText("Reserved Community Description")).toBeInTheDocument()
    expect(results.getByText("For folks who serve in the armed forces")).toBeInTheDocument()
    expect(
      results.getByText(
        "Do you want to include a community type disclaimer as the first page of the application?"
      )
    ).toBeInTheDocument()
  })

  it.todo("should not render include community disclaimer section when set to false")

  it.todo("should render include community disclaimer section when set to true")
})
