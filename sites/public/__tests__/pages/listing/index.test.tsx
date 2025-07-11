import React from "react"
import { setupServer } from "msw/lib/node"
import { mockNextRouter } from "../../testUtils"
import { render } from "@testing-library/react"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { ListingViewSeeds } from "../../../src/components/listing/ListingViewSeeds"
import { jurisdiction, listing, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const server = setupServer()

beforeAll(() => {
  mockNextRouter()
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

const TOAST_MESSAGE = {
  toastMessagesRef: { current: [] },
  addToast: jest.fn(),
}

function renderListingPreview(listing: Listing, jurisdiction: Jurisdiction) {
  return render(
    <MessageContext.Provider value={TOAST_MESSAGE}>
      <AuthContext.Provider
        value={{
          profile: {
            ...user,
            listings: [],
            jurisdictions: [],
          },
        }}
      >
        <ListingViewSeeds listing={listing} jurisdiction={jurisdiction} />
      </AuthContext.Provider>
    </MessageContext.Provider>
  )
}

describe("<ListingViewSeeds>", () => {
  it.skip("should return error page on missing listing", () => {
    renderListingPreview({} as Listing, jurisdiction)
  })
  describe("Main Details section")
  describe("Rent Summary section")
  describe("Eligibility section", () => {
    describe("Reserved community type", () => {
      it.skip("hide section if swapCommunityTypeWithPrograms is turned off")
      it.skip("hide section if no reservedCommunityTypes have been set")
      it.skip("render card list with available community types")
    })
    describe("HMI", () => {
      it.skip("hide section for units if stackedHmiData is unavailable")
      it.skip("hide section for units groups if stackedUnitGroupsHmiData is unavailable")
      it.skip("render stacked table for units HMI data")
      it.skip("render stacked table for units groups HMI data")
    })
    describe("Occupancy", () => {
      it.skip("hide section for units if no occupancy data has been extraced")
      it.skip("hide section for unit groups if no occupancy data has been extraced")
      it.skip("render stacked table for units occupancy")
      it.skip("render stacked table for unit groups occupancy with no unit types duplicates")
      it.skip("render stacked table for unit groups occupancy with unit types duplicates")
    })
    describe("Rental Accistance", () => {
      it.skip("hide section if not rental assistance data avialble")
      it.skip("render the rental assistance section with given information")
    })
    describe("Housing Preferences", () => {
      it.skip("hide section if no preferences have been found")
      it.skip("hide section if the disableListingPreferences feature flag is turned on")
      it.skip("render the prefrences section with all given data")
    })
    describe("Housing Programs", () => {
      it.skip("hide section if no programs are available")
      it.skip("render the programs section with all given data")
    })
    describe("Additional Eligbility", () => {
      it.skip("hide section if no additional rules are configured")
      it.skip("render credit history rules only")
      it.skip("render rental history rules only")
      it.skip("render criminal background rules only")
      it.skip("render all additional rules")
    })
  })
  describe("Features section", () => {
    it.skip("render listing features units summary and fees sub-sections")
    it.skip("hide units accordion if the disableUnitsAccordion flag is turned on")
  })
  describe("Neighborhood section", () => {
    it.skip("render the neighborhood section with all its contents")
    it.skip("hide the nighborhood section if unnavailable")
    it.skip("hide the nighborhood amenities section if unnavailable")
    it.skip("hide the regions section if unnavailable")
    it.skip("hide the nighborhood amenities section if feature flag has been turned off")
    it.skip("hide the regions section if feature flag has been turned off")
  })
  describe("Additional Information section", () => {
    it.skip("render empty section if no additional information is available")
    it.skip("render section with Required Documents info only")
    it.skip("render section with Program Rules info only")
    it.skip("render section with Special Notes info only")
    it.skip("render section with all additional info")
  })
  describe("Availablity Side Bar", () => {
    it.skip("render empty availablity side bar")
    it.skip("hide availability details if listing status is closed")
    it.skip("hide availability details if marketing status is commingSoon")
    it.skip("hide status message if listing status is closed")
    it.skip("show listing construction conent if marketing status is comingSoon")
    it.skip("show lottery conent for unit groups")
    it.skip("show waitlist conent for unit groups")
    it.skip("show first come first served conent for unit groups")
    it.skip("show lottery conent for units")
    it.skip("show waitlist conent for units")
    it.skip("show first come first served conent for units")
    it.skip("show reserved community types if available")
  })
  describe("Application side bar")
})
