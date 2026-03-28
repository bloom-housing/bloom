import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, waitFor } from "@testing-library/react"
import { blankApplication } from "@bloom-housing/shared-helpers"
import {
  ApplicationAccessibilityFeatureEnum,
  Listing,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationConductor from "../../../../src/lib/applications/ApplicationConductor"
import {
  AppSubmissionContext,
  retrieveApplicationConfig,
} from "../../../../src/lib/applications/AppSubmissionContext"
import ApplicationAda from "../../../../src/pages/applications/household/ada"

window.scrollTo = jest.fn()

const server = setupServer()
const configuredAdaFeatures = [
  ApplicationAccessibilityFeatureEnum.mobility,
  ApplicationAccessibilityFeatureEnum.vision,
  ApplicationAccessibilityFeatureEnum.hearing,
]

const alternateAdaFeatures = [
  ApplicationAccessibilityFeatureEnum.mobility,
  ApplicationAccessibilityFeatureEnum.hearingAndVision,
  ApplicationAccessibilityFeatureEnum.other,
]

const renderWithConfiguredAdaFeatures = (adaFeatures: ApplicationAccessibilityFeatureEnum[]) => {
  const conductor = new ApplicationConductor({}, {})
  const applicationConfig = retrieveApplicationConfig(conductor.listing, [])
  conductor.config = {
    ...conductor.config,
    ...applicationConfig,
    visibleApplicationAccessibilityFeatures: adaFeatures,
  }

  return render(
    <AppSubmissionContext.Provider
      value={{
        conductor,
        application: JSON.parse(JSON.stringify(blankApplication)),
        listing: {} as Listing,
        syncApplication: () => {
          return
        },
        syncListing: () => {
          return
        },
      }}
    >
      <ApplicationAda />
    </AppSubmissionContext.Provider>
  )
}

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

  describe("ada step", () => {
    it("should render form fields", () => {
      const { getByText, getByTestId } = renderWithConfiguredAdaFeatures(configuredAdaFeatures)

      expect(
        getByText(
          "Do you or anyone in your household need any of the following ADA accessibility features?"
        )
      ).toBeInTheDocument()
      configuredAdaFeatures.forEach((feature) => {
        expect(getByTestId(`app-ada-${feature}`)).toBeInTheDocument()
      })
      expect(getByTestId("app-ada-none")).toBeInTheDocument()
    })

    it("should render alternate ada features", () => {
      const { getByTestId } = renderWithConfiguredAdaFeatures(alternateAdaFeatures)
      alternateAdaFeatures.forEach((feature) => {
        expect(getByTestId(`app-ada-${feature}`)).toBeInTheDocument()
      })
      expect(getByTestId("app-ada-none")).toBeInTheDocument()
    })

    it("should require form input", async () => {
      const { getByText, findByText } = renderWithConfiguredAdaFeatures(configuredAdaFeatures)

      fireEvent.click(getByText("No"))
      fireEvent.click(getByText("Next"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please select one of the options above.")).toBeInTheDocument()
    })

    it("should uncheck all other boxes when 'No' is selected", async () => {
      const { getByText, getByTestId } = renderWithConfiguredAdaFeatures(configuredAdaFeatures)
      configuredAdaFeatures.forEach((feature) => {
        fireEvent.click(getByText(t(`application.ada.${feature}`)))
      })

      configuredAdaFeatures.forEach((feature) => {
        expect(getByTestId(`app-ada-${feature}`)).toBeChecked()
      })
      await waitFor(() => {
        expect(getByTestId("app-ada-none")).not.toBeChecked()
      })

      fireEvent.click(getByText("No"))

      configuredAdaFeatures.forEach((feature) => {
        expect(getByTestId(`app-ada-${feature}`)).not.toBeChecked()
      })
      expect(getByTestId("app-ada-none")).toBeChecked()
    })
  })
})
