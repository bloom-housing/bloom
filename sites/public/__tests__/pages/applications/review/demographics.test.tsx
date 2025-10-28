import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, screen } from "@testing-library/react"
import { blankApplication } from "@bloom-housing/shared-helpers"
import {
  FeatureFlag,
  FeatureFlagEnum,
  Listing,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
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
      const { getByText, getByTestId, getAllByTestId } = render(<ApplicationDemographics />)

      expect(
        getByText("Help us ensure we are meeting our goal to serve all people")
      ).toBeInTheDocument()
      expect(getByTestId("americanIndianAlaskanNative")).toBeInTheDocument()
      expect(getByTestId("asian")).toBeInTheDocument()
      expect(getByTestId("blackAfricanAmerican")).toBeInTheDocument()
      expect(getByTestId("nativeHawaiianOtherPacificIslander")).toBeInTheDocument()
      expect(getByTestId("white")).toBeInTheDocument()
      expect(getByTestId("otherMultiracial")).toBeInTheDocument()
      expect(getByTestId("declineToRespond")).toBeInTheDocument()
      expect(getByTestId("app-demographics-ethnicity")).toBeInTheDocument()
      expect(getAllByTestId("app-demographics-how-did-you-hear")).toHaveLength(9)
    })

    it("should render sub demographics fields when parent is checked", () => {
      const { getByText, queryByText } = render(<ApplicationDemographics />)

      expect(queryByText("Asian Indian")).not.toBeInTheDocument()
      expect(queryByText("Chinese")).not.toBeInTheDocument()
      expect(queryByText("Filipino")).not.toBeInTheDocument()
      expect(queryByText("Japanese")).not.toBeInTheDocument()
      expect(queryByText("Korean")).not.toBeInTheDocument()
      expect(queryByText("Vietnamese")).not.toBeInTheDocument()
      expect(queryByText("Other Asian")).not.toBeInTheDocument()

      fireEvent.click(getByText("Asian"))

      expect(getByText("Asian Indian")).toBeInTheDocument()
      expect(getByText("Chinese")).toBeInTheDocument()
      expect(getByText("Filipino")).toBeInTheDocument()
      expect(getByText("Japanese")).toBeInTheDocument()
      expect(getByText("Korean")).toBeInTheDocument()
      expect(getByText("Vietnamese")).toBeInTheDocument()
      expect(getByText("Other Asian")).toBeInTheDocument()

      expect(queryByText("Native Hawaiian")).not.toBeInTheDocument()
      expect(queryByText("Guamanian or Chamorro")).not.toBeInTheDocument()
      expect(queryByText("Samoan")).not.toBeInTheDocument()
      expect(queryByText("Other Pacific Islander")).not.toBeInTheDocument()

      fireEvent.click(getByText("Native Hawaiian / Other Pacific Islander"))

      expect(getByText("Native Hawaiian")).toBeInTheDocument()
      expect(getByText("Guamanian or Chamorro")).toBeInTheDocument()
      expect(getByText("Samoan")).toBeInTheDocument()
      expect(getByText("Other Pacific Islander")).toBeInTheDocument()
    })

    it("should show other text fields when other options are checked", async () => {
      const { getByText, queryByTestId, findAllByTestId } = render(<ApplicationDemographics />)

      expect(queryByTestId("asian-otherAsian")).not.toBeInTheDocument()
      fireEvent.click(getByText("Asian"))
      fireEvent.click(getByText("Other Asian"))
      expect(await findAllByTestId("asian-otherAsian")).toHaveLength(2)

      expect(
        queryByTestId("nativeHawaiianOtherPacificIslander-otherPacificIslander")
      ).not.toBeInTheDocument()
      fireEvent.click(getByText("Native Hawaiian / Other Pacific Islander"))
      fireEvent.click(getByText("Other Pacific Islander"))
      expect(
        await findAllByTestId("nativeHawaiianOtherPacificIslander-otherPacificIslander")
      ).toHaveLength(2)

      expect(await findAllByTestId("otherMultiracial")).toHaveLength(1)
      fireEvent.click(getByText("Other / Multiracial"))
      expect(await findAllByTestId("otherMultiracial")).toHaveLength(2)
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
})
