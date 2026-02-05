import { AuthProvider, blankApplication } from "@bloom-housing/shared-helpers"
import {
  EnumListingListingType,
  FeatureFlag,
  FeatureFlagEnum,
  Listing,
  Unit,
  UnitGroup,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { setupServer } from "msw/lib/node"
import ApplicationConductor from "../../../../src/lib/applications/ApplicationConductor"
import { AppSubmissionContext } from "../../../../src/lib/applications/AppSubmissionContext"
import ApplicationPreferredUnits from "../../../../src/pages/applications/household/preferred-units"
import { mockNextRouter, render, screen, within } from "../../../testUtils"

window.scrollTo = jest.fn()

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("applications pages", () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  describe("preferred units step", () => {
    it("should render form fields for units", () => {
      const conductor = new ApplicationConductor({}, {})

      render(
        <AppSubmissionContext.Provider
          value={{
            conductor: conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: {
              units: [
                { unitTypes: { name: "studio", id: "studio-id" } } as Unit,
                { unitTypes: { name: "twoBdrm", id: "2br-id" } } as Unit,
              ],
            } as Listing,
            syncApplication: () => {
              return
            },
            syncListing: () => {
              return
            },
          }}
        >
          <AuthProvider>
            <ApplicationPreferredUnits />
          </AuthProvider>
        </AppSubmissionContext.Provider>
      )

      expect(
        screen.getByRole("heading", { name: "What unit sizes are you interested in?", level: 2 })
      ).toBeInTheDocument()
      expect(screen.getByText("Select all that apply:")).toBeInTheDocument()
      const preferredUnitType = screen.getByRole("group", { name: "Preferred unit type" })
      expect(
        within(preferredUnitType).getByRole("checkbox", { name: "Studio" })
      ).toBeInTheDocument()
    })

    it("should render form fields for unit groups", () => {
      const conductor = new ApplicationConductor({}, {})
      conductor.config.featureFlags = [
        { name: FeatureFlagEnum.enableUnitGroups, active: true } as FeatureFlag,
      ]

      render(
        <AppSubmissionContext.Provider
          value={{
            conductor: conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: {
              unitGroups: [
                { unitTypes: [{ name: "studio", id: "studio-id" }] } as UnitGroup,
                { unitTypes: [{ name: "twoBdrm", id: "2br-id" }], openWaitlist: true } as UnitGroup,
              ],
            } as Listing,
            syncApplication: () => {
              return
            },
            syncListing: () => {
              return
            },
          }}
        >
          <AuthProvider>
            <ApplicationPreferredUnits />
          </AuthProvider>
        </AppSubmissionContext.Provider>
      )

      expect(
        screen.getByRole("heading", { name: "What unit sizes are you interested in?", level: 2 })
      ).toBeInTheDocument()
      expect(screen.getByText("Select all that apply:")).toBeInTheDocument()
      const preferredUnitType = screen.getByRole("group", { name: "Preferred unit type" })
      expect(within(preferredUnitType).queryAllByRole("checkbox", { name: "Studio" })).toHaveLength(
        0
      )
      expect(
        within(preferredUnitType).getByRole("checkbox", { name: "2 bedroom" })
      ).toBeInTheDocument()
    })

    it("should render form fields for unit groups and non regulated", () => {
      const conductor = new ApplicationConductor({}, {})
      conductor.config.featureFlags = [
        { name: FeatureFlagEnum.enableUnitGroups, active: true } as FeatureFlag,
      ]

      render(
        <AppSubmissionContext.Provider
          value={{
            conductor: conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: {
              listingType: EnumListingListingType.nonRegulated,
              unitGroups: [
                { unitTypes: [{ name: "studio", id: "studio-id" }] } as UnitGroup,
                { unitTypes: [{ name: "twoBdrm", id: "2br-id" }] } as UnitGroup,
              ],
            } as Listing,
            syncApplication: () => {
              return
            },
            syncListing: () => {
              return
            },
          }}
        >
          <AuthProvider>
            <ApplicationPreferredUnits />
          </AuthProvider>
        </AppSubmissionContext.Provider>
      )

      expect(
        screen.getByRole("heading", { name: "What unit sizes are you interested in?", level: 2 })
      ).toBeInTheDocument()
      expect(screen.getByText("Select all that apply:")).toBeInTheDocument()
      const preferredUnitType = screen.getByRole("group", { name: "Preferred unit type" })
      expect(
        within(preferredUnitType).getByRole("checkbox", { name: "Studio" })
      ).toBeInTheDocument()
      expect(
        within(preferredUnitType).getByRole("checkbox", { name: "2 bedroom" })
      ).toBeInTheDocument()
    })

    it.todo("should display error if non preferred unit type is selected")
  })
})
