import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, screen } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationAddress from "../../../../src/pages/applications/contact/address"
import ApplicationConductor from "../../../../src/lib/applications/ApplicationConductor"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  AppSubmissionContext,
  retrieveApplicationConfig,
} from "../../../../src/lib/applications/AppSubmissionContext"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { blankApplication } from "@bloom-housing/shared-helpers"

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

  describe("address step", () => {
    it("should render form fields", () => {
      const { getByText, getByTestId, getAllByTestId } = render(<ApplicationAddress />)

      expect(
        getByText("Now we need to know how to contact you about your application.", {
          exact: false,
        })
      ).toBeInTheDocument()
      expect(getByTestId("app-primary-phone-number")).toBeInTheDocument()
      expect(getByTestId("app-primary-phone-number-type")).toBeInTheDocument()
      expect(getByTestId("app-primary-no-phone")).toBeInTheDocument()
      expect(getByTestId("app-primary-additional-phone")).toBeInTheDocument()
      expect(getByTestId("app-primary-address-street")).toBeInTheDocument()
      expect(getByTestId("app-primary-address-street2")).toBeInTheDocument()
      expect(getByTestId("app-primary-address-city")).toBeInTheDocument()
      expect(getByTestId("app-primary-address-state")).toBeInTheDocument()
      expect(getByTestId("app-primary-address-zip")).toBeInTheDocument()
      expect(getByTestId("app-primary-send-to-mailing")).toBeInTheDocument()
      expect(getAllByTestId("app-primary-contact-preference")).toHaveLength(4)
      expect(getByTestId("app-primary-work-in-region-yes")).toBeInTheDocument()
      expect(getByTestId("app-primary-work-in-region-no")).toBeInTheDocument()
    })

    it("should require form input", async () => {
      const { getByText, findByText } = render(<ApplicationAddress />)

      fireEvent.click(getByText("Next"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please enter a phone number")).toBeInTheDocument()
      expect(getByText("Please enter a phone number type")).toBeInTheDocument()
      expect(getByText("Please enter an address")).toBeInTheDocument()
      expect(getByText("Please select at least one option.")).toBeInTheDocument()
      expect(getByText("Please select one of the options above.")).toBeInTheDocument()
    })

    it("should disable phone fields if user indicates they don't have a phone", async () => {
      const { getByText, findByTestId, getByTestId } = render(<ApplicationAddress />)

      expect(getByTestId("app-primary-phone-number").firstChild).toBeEnabled()
      fireEvent.click(getByText("I don't have a telephone number"))
      expect((await findByTestId("app-primary-phone-number")).firstChild).toBeDisabled()
      expect(await findByTestId("app-primary-phone-number-type")).toBeDisabled()
    })

    it("should hide work in region question when flag enabled", () => {
      const conductor = new ApplicationConductor({}, listing)
      const applicationConfig = retrieveApplicationConfig(conductor.listing)
      conductor.config = {
        ...applicationConfig,
        languages: [],
        featureFlags: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            id: "test_id",
            name: FeatureFlagEnum.disableWorkInRegion,
            active: true,
            description: "",
            jurisdictions: [],
          },
        ],
      }

      render(
        <AppSubmissionContext.Provider
          value={{
            conductor: conductor,
            application: JSON.parse(JSON.stringify(blankApplication)),
            listing: listing,
            syncApplication: jest.fn(),
            syncListing: jest.fn(),
          }}
        >
          <ApplicationAddress />
        </AppSubmissionContext.Provider>
      )

      expect(
        screen.getByText("Now we need to know how to contact you about your application.", {
          exact: false,
        })
      ).toBeInTheDocument()
      expect(screen.getByTestId("app-primary-phone-number")).toBeInTheDocument()
      expect(screen.getByTestId("app-primary-phone-number-type")).toBeInTheDocument()
      expect(screen.getByTestId("app-primary-no-phone")).toBeInTheDocument()
      expect(screen.getByTestId("app-primary-additional-phone")).toBeInTheDocument()
      expect(screen.getByTestId("app-primary-address-street")).toBeInTheDocument()
      expect(screen.getByTestId("app-primary-address-street2")).toBeInTheDocument()
      expect(screen.getByTestId("app-primary-address-city")).toBeInTheDocument()
      expect(screen.getByTestId("app-primary-address-state")).toBeInTheDocument()
      expect(screen.getByTestId("app-primary-address-zip")).toBeInTheDocument()
      expect(screen.getByTestId("app-primary-send-to-mailing")).toBeInTheDocument()
      expect(screen.getAllByTestId("app-primary-contact-preference")).toHaveLength(4)
      expect(screen.queryByTestId("app-primary-work-in-region-yes")).not.toBeInTheDocument()
      expect(screen.queryByTestId("app-primary-work-in-region-no")).not.toBeInTheDocument()
    })
  })
})
