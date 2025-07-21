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
  it.todo("should return error page on missing listing")
  describe("Main Details section", () => {
    it.todo("should render details section contents")
  })
  describe("Rent Summary section", () => {
    it.todo("should render rent summary table")
  })
  describe("Eligibility section", () => {
    describe("Reserved community type", () => {
      it.todo("hide section if swapCommunityTypeWithPrograms is turned off")
      it.todo("hide section if no reservedCommunityTypes have been set")
      it.todo("render card list with available community types")
    })
    describe("HMI", () => {
      it.todo("hide section for units if stackedHmiData is unavailable")
      it.todo("hide section for units groups if stackedUnitGroupsHmiData is unavailable")
      it.todo("render stacked table for units HMI data")
      it.todo("render stacked table for units groups HMI data")
    })
    describe("Occupancy", () => {
      it.todo("hide section for units if no occupancy data has been extraced")
      it.todo("hide section for unit groups if no occupancy data has been extraced")
      it.todo("render stacked table for units occupancy")
      it.todo("render stacked table for unit groups occupancy with no unit types duplicates")
      it.todo("render stacked table for unit groups occupancy with unit types duplicates")
    })
    describe("Rental Accistance", () => {
      it.todo("hide section if not rental assistance data avialble")
      it.todo("render the rental assistance section with given information")
    })
    describe("Housing Preferences", () => {
      it.todo("hide section if no preferences have been found")
      it.todo("hide section if the disableListingPreferences feature flag is turned on")
      it.todo("render the prefrences section with all given data")
    })
    describe("Housing Programs", () => {
      it.todo("hide section if no programs are available")
      it.todo("render the programs section with all given data")
    })
    describe("Additional Eligbility", () => {
      it.todo("hide section if no additional rules are configured")
      it.todo("render credit history rules only")
      it.todo("render rental history rules only")
      it.todo("render criminal background rules only")
      it.todo("render all additional rules")
    })
  })
  describe("Features section", () => {
    it.todo("render listing features units summary and fees sub-sections")
    it.todo("hide units accordion if the disableUnitsAccordion flag is turned on")
  })
  describe("Neighborhood section", () => {
    it.todo("render the neighborhood section with all its contents")
    it.todo("hide the nighborhood section if unnavailable")
    it.todo("hide the nighborhood amenities section if unnavailable")
    it.todo("hide the regions section if unnavailable")
    it.todo("hide the nighborhood amenities section if feature flag has been turned off")
    it.todo("hide the regions section if feature flag has been turned off")
  })
  describe("Additional Information section", () => {
    it.todo("render empty section if no additional information is available")
    it.todo("render section with Required Documents info only")
    it.todo("render section with Program Rules info only")
    it.todo("render section with Special Notes info only")
    it.todo("render section with all additional info")
  })
  describe("Availablity Side Bar", () => {
    it.todo("render empty availablity side bar")
    it.todo("hide availability details if listing status is closed")
    it.todo("hide availability details if marketing status is commingSoon")
    it.todo("hide status message if listing status is closed")
    it.todo("show listing construction conent if marketing status is comingSoon")
    it.todo("show lottery conent for unit groups")
    it.todo("show waitlist conent for unit groups")
    it.todo("show first come first served conent for unit groups")
    it.todo("show lottery conent for units")
    it.todo("show waitlist conent for units")
    it.todo("show first come first served conent for units")
    it.todo("show reserved community types if available")
  })
  describe("Application side bar", () => {
    it.todo("should render application side bar content")
  })
})
