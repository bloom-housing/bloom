import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, screen } from "@testing-library/react"
import { blankApplication } from "@bloom-housing/shared-helpers"
import {
  FeatureFlag,
  FeatureFlagEnum,
  Listing,
  RaceEthnicityConfiguration,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { defaultRaceEthnicityConfiguration } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationConductor from "../../../../src/lib/applications/ApplicationConductor"
import { AppSubmissionContext } from "../../../../src/lib/applications/AppSubmissionContext"
import ApplicationDemographics from "../../../../src/pages/applications/review/demographics"

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

  describe("demographics step", () => {
    it("should render form fields", () => {
      const conductor = new ApplicationConductor({}, {})
      conductor.config.featureFlags = [
        { name: FeatureFlagEnum.enableLimitedHowDidYouHear, active: false } as FeatureFlag,
      ]
      conductor.config.raceEthnicityConfiguration = defaultRaceEthnicityConfiguration

      render(
        <AppSubmissionContext.Provider
          value={{
            conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: {} as unknown as Listing,
            syncApplication: () => {
              return
            },
            syncListing: () => {
              return
            },
          }}
        >
          <ApplicationDemographics />
        </AppSubmissionContext.Provider>
      )

      expect(
        screen.getByText("Help us ensure we are meeting our goal to serve all people")
      ).toBeInTheDocument()
      expect(
        screen.getByText("Which best describes your race? Please select all that apply:", {
          selector: "legend",
        })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("checkbox", { name: "American Indian / Alaskan Native" })
      ).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Asian" })).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Black / African American" })).toBeInTheDocument()
      expect(
        screen.getByRole("checkbox", { name: "Native Hawaiian / Other Pacific Islander" })
      ).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "White" })).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Other / Multiracial" })).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "Decline to respond" })).toBeInTheDocument()
      expect(screen.getByLabelText("Which best describes your ethnicity?")).toBeInTheDocument()
      expect(screen.getAllByTestId("app-demographics-how-did-you-hear")).toHaveLength(9)
    })

    it("should render sub demographics fields when parent is checked", () => {
      const conductor = new ApplicationConductor({}, {})
      conductor.config.featureFlags = [
        { name: FeatureFlagEnum.enableLimitedHowDidYouHear, active: false } as FeatureFlag,
      ]
      conductor.config.raceEthnicityConfiguration = defaultRaceEthnicityConfiguration

      render(
        <AppSubmissionContext.Provider
          value={{
            conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: {} as unknown as Listing,
            syncApplication: () => {
              return
            },
            syncListing: () => {
              return
            },
          }}
        >
          <ApplicationDemographics />
        </AppSubmissionContext.Provider>
      )

      expect(screen.queryByText("Asian Indian")).not.toBeInTheDocument()
      expect(screen.queryByText("Chinese")).not.toBeInTheDocument()
      expect(screen.queryByText("Filipino")).not.toBeInTheDocument()
      expect(screen.queryByText("Japanese")).not.toBeInTheDocument()
      expect(screen.queryByText("Korean")).not.toBeInTheDocument()
      expect(screen.queryByText("Vietnamese")).not.toBeInTheDocument()
      expect(screen.queryByText("Other Asian")).not.toBeInTheDocument()

      fireEvent.click(screen.getByText("Asian"))

      expect(screen.getByText("Asian Indian")).toBeInTheDocument()
      expect(screen.getByText("Chinese")).toBeInTheDocument()
      expect(screen.getByText("Filipino")).toBeInTheDocument()
      expect(screen.getByText("Japanese")).toBeInTheDocument()
      expect(screen.getByText("Korean")).toBeInTheDocument()
      expect(screen.getByText("Vietnamese")).toBeInTheDocument()
      expect(screen.getByText("Other Asian")).toBeInTheDocument()

      expect(screen.queryByText("Native Hawaiian")).not.toBeInTheDocument()
      expect(screen.queryByText("Guamanian or Chamorro")).not.toBeInTheDocument()
      expect(screen.queryByText("Samoan")).not.toBeInTheDocument()
      expect(screen.queryByText("Other Pacific Islander")).not.toBeInTheDocument()

      fireEvent.click(screen.getByText("Native Hawaiian / Other Pacific Islander"))

      expect(screen.getByText("Native Hawaiian")).toBeInTheDocument()
      expect(screen.getByText("Guamanian or Chamorro")).toBeInTheDocument()
      expect(screen.getByText("Samoan")).toBeInTheDocument()
      expect(screen.getByText("Other Pacific Islander")).toBeInTheDocument()
    })

    it("should show other text fields when other options are checked", async () => {
      const conductor = new ApplicationConductor({}, {})
      conductor.config.featureFlags = [
        { name: FeatureFlagEnum.enableLimitedHowDidYouHear, active: false } as FeatureFlag,
      ]
      conductor.config.raceEthnicityConfiguration = defaultRaceEthnicityConfiguration

      render(
        <AppSubmissionContext.Provider
          value={{
            conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: {} as unknown as Listing,
            syncApplication: () => {
              return
            },
            syncListing: () => {
              return
            },
          }}
        >
          <ApplicationDemographics />
        </AppSubmissionContext.Provider>
      )

      expect(screen.queryByTestId("asian-otherAsian")).not.toBeInTheDocument()
      fireEvent.click(screen.getByText("Asian"))
      fireEvent.click(screen.getByText("Other Asian"))
      expect(await screen.findAllByTestId("asian-otherAsian")).toHaveLength(2)

      expect(
        screen.queryByTestId("nativeHawaiianOtherPacificIslander-otherPacificIslander")
      ).not.toBeInTheDocument()
      fireEvent.click(screen.getByText("Native Hawaiian / Other Pacific Islander"))
      fireEvent.click(screen.getByText("Other Pacific Islander"))
      expect(
        await screen.findAllByTestId("nativeHawaiianOtherPacificIslander-otherPacificIslander")
      ).toHaveLength(2)

      expect(await screen.findAllByTestId("otherMultiracial")).toHaveLength(1)
      fireEvent.click(screen.getByText("Other / Multiracial"))
      expect(await screen.findAllByTestId("otherMultiracial")).toHaveLength(2)
    })
  })

  it("should show full list of how did you hear fields", () => {
    render(<ApplicationDemographics />)
    expect(screen.getByText("How did you hear about this listing?")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Alameda County HCD Website" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Developer website" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Flyer" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Email alert" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Friend" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Friend" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Housing counselor" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Radio ad" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Bus ad" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Other" })).toBeInTheDocument()
  })

  it("should show limited list of how did you hear fields when enableLimitedHowDidYouHear is on", () => {
    const conductor = new ApplicationConductor({}, {})
    conductor.config.featureFlags = [
      { name: FeatureFlagEnum.enableLimitedHowDidYouHear, active: true } as FeatureFlag,
    ]
    render(
      <AppSubmissionContext.Provider
        value={{
          conductor: conductor,
          application: JSON.parse(JSON.stringify(blankApplication)),
          listing: {} as unknown as Listing,
          syncApplication: () => {
            return
          },
          syncListing: () => {
            return
          },
        }}
      >
        <ApplicationDemographics />
      </AppSubmissionContext.Provider>
    )
    expect(screen.getByText("How did you hear about this listing?")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Alameda County HCD Website" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Developer website" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Flyer" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Email alert" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Friend" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Friend" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Housing counselor" })).toBeInTheDocument()
    expect(screen.queryByRole("checkbox", { name: "Radio ad" })).not.toBeInTheDocument()
    expect(screen.queryByRole("checkbox", { name: "Bus ad" })).not.toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Other" })).toBeInTheDocument()
  })

  it("should hide ethnicity field when disabledEthnicityQuestion flag is on", () => {
    const conductor = new ApplicationConductor({}, {})
    conductor.config.featureFlags = [
      { name: FeatureFlagEnum.disableEthnicityQuestion, active: true } as FeatureFlag,
    ]
    render(
      <AppSubmissionContext.Provider
        value={{
          conductor: conductor,
          application: JSON.parse(JSON.stringify(blankApplication)),
          listing: {} as unknown as Listing,
          syncApplication: () => {
            return
          },
          syncListing: () => {
            return
          },
        }}
      >
        <ApplicationDemographics />
      </AppSubmissionContext.Provider>
    )
    expect(screen.queryByLabelText("Which best describes your ethnicity?")).not.toBeInTheDocument()
    expect(
      screen.getByText("Which best describes your race/ethnicity? Please select all that apply:", {
        selector: "legend",
      })
    ).toBeInTheDocument()
  })

  describe("with custom race/ethnicity configuration", () => {
    it("should render race options from jurisdiction configuration", () => {
      const customConfig: RaceEthnicityConfiguration = {
        options: [
          {
            id: "blackAfricanAmerican",
            hasSubOptions: false,
            subOptions: [],
            allowOtherText: false,
          },
          {
            id: "white",
            hasSubOptions: false,
            subOptions: [],
            allowOtherText: false,
          },
          {
            id: "otherMultiracial",
            hasSubOptions: false,
            subOptions: [],
            allowOtherText: true,
          },
        ],
      }

      const conductor = new ApplicationConductor({}, {})
      conductor.config.featureFlags = [
        { name: FeatureFlagEnum.enableLimitedHowDidYouHear, active: true } as FeatureFlag,
      ]
      conductor.config.raceEthnicityConfiguration = customConfig

      render(
        <AppSubmissionContext.Provider
          value={{
            conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: {} as unknown as Listing,
            syncApplication: () => {
              return
            },
            syncListing: () => {
              return
            },
          }}
        >
          <ApplicationDemographics />
        </AppSubmissionContext.Provider>
      )

      // Should render only configured options
      expect(screen.getByTestId("white")).toBeInTheDocument()
      expect(screen.getByTestId("blackAfricanAmerican")).toBeInTheDocument()
      expect(screen.getByTestId("otherMultiracial")).toBeInTheDocument()

      // Should not render non-configured options
      expect(screen.queryByTestId("americanIndianAlaskanNative")).not.toBeInTheDocument()
      expect(screen.queryByTestId("asian")).not.toBeInTheDocument()
      expect(screen.queryByTestId("nativeHawaiianOtherPacificIslander")).not.toBeInTheDocument()
      expect(screen.queryByTestId("declineToRespond")).not.toBeInTheDocument()
    })

    it("should render custom suboptions from configuration", () => {
      const customConfig: RaceEthnicityConfiguration = {
        options: [
          {
            id: "asian",
            hasSubOptions: true,
            subOptions: [
              { id: "chinese", allowOtherText: false },
              { id: "vietnamese", allowOtherText: false },
            ],
            allowOtherText: false,
          },
        ],
      }

      const conductor = new ApplicationConductor({}, {})
      conductor.config.featureFlags = [
        { name: FeatureFlagEnum.enableLimitedHowDidYouHear, active: true } as FeatureFlag,
      ]
      conductor.config.raceEthnicityConfiguration = customConfig

      render(
        <AppSubmissionContext.Provider
          value={{
            conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: {} as unknown as Listing,
            syncApplication: () => {
              return
            },
            syncListing: () => {
              return
            },
          }}
        >
          <ApplicationDemographics />
        </AppSubmissionContext.Provider>
      )

      // Asian option should be available
      expect(screen.getByTestId("asian")).toBeInTheDocument()

      // Custom suboptions should not be visible until parent is checked
      expect(screen.queryByText("Chinese")).not.toBeInTheDocument()
      expect(screen.queryByText("Vietnamese")).not.toBeInTheDocument()

      // Click asian checkbox to expand suboptions
      const asianCheckbox = screen.getByTestId("asian")
      fireEvent.click(asianCheckbox)

      // Custom suboptions should now be visible
      expect(screen.getByText("Chinese")).toBeInTheDocument()
      expect(screen.getByText("Vietnamese")).toBeInTheDocument()

      // Other Asian suboptions should not be visible (not in config)
      expect(screen.queryByText("Japanese")).not.toBeInTheDocument()
      expect(screen.queryByText("Filipino")).not.toBeInTheDocument()
    })

    it("should handle empty race configuration", () => {
      const emptyConfig: RaceEthnicityConfiguration = {
        options: [],
      }

      const conductor = new ApplicationConductor({}, {})
      conductor.config.featureFlags = [
        { name: FeatureFlagEnum.enableLimitedHowDidYouHear, active: true } as FeatureFlag,
      ]
      conductor.config.raceEthnicityConfiguration = emptyConfig

      render(
        <AppSubmissionContext.Provider
          value={{
            conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: {} as unknown as Listing,
            syncApplication: () => {
              return
            },
            syncListing: () => {
              return
            },
          }}
        >
          <ApplicationDemographics />
        </AppSubmissionContext.Provider>
      )

      // Should still render form title and ethnicity field
      expect(
        screen.getByText("Help us ensure we are meeting our goal to serve all people")
      ).toBeInTheDocument()
      expect(screen.getByText(/ethnicity/i)).toBeInTheDocument()

      // But no race options should be present
      expect(screen.queryByTestId("americanIndianAlaskanNative")).not.toBeInTheDocument()
      expect(screen.queryByTestId("asian")).not.toBeInTheDocument()
      expect(screen.queryByTestId("white")).not.toBeInTheDocument()
    })
  })
})
