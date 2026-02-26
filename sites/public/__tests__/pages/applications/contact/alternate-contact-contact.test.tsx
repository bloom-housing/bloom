import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render, within } from "../../../testUtils"
import ApplicationAlternateContactContact from "../../../../src/pages/applications/contact/alternate-contact-contact"
import {
  AppSubmissionContext,
  retrieveApplicationConfig,
} from "../../../../src/lib/applications/AppSubmissionContext"
import ApplicationConductor from "../../../../src/lib/applications/ApplicationConductor"
import { AuthContext, blankApplication } from "@bloom-housing/shared-helpers"
import { listing, user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"

window.scrollTo = jest.fn()

const server = setupServer()
const renderWithAdvocate = () => {
  const conductor = new ApplicationConductor({}, {})
  const applicationConfig = retrieveApplicationConfig(conductor.listing, [])
  conductor.config = {
    ...applicationConfig,
    languages: [],
    featureFlags: [],
    isAdvocate: true,
  }
  const application = JSON.parse(JSON.stringify(blankApplication))
  const profile = {
    ...user,
    email: "advocate@bloom.test",
    phoneNumber: "1234567890",
    isAdvocate: true,
    listings: [],
    jurisdictions: [],
    address: {
      id: "address-id",
      street: "1 Main St",
      street2: "Unit 2",
      city: "Angelopolis",
      state: "CA",
      zipCode: "90210",
    },
  }

  const rendered = render(
    <AuthContext.Provider value={{ profile }}>
      <AppSubmissionContext.Provider
        value={{
          conductor,
          application,
          listing,
          syncApplication: jest.fn(),
          syncListing: jest.fn(),
        }}
      >
        <ApplicationAlternateContactContact />
      </AppSubmissionContext.Provider>
    </AuthContext.Provider>
  )

  return { ...rendered, application, profile }
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

  describe("alternate contact contact step", () => {
    it("should render form fields", () => {
      const { getByText, getByTestId } = render(<ApplicationAlternateContactContact />)

      expect(getByText("Let us know how to reach your alternate contact.")).toBeInTheDocument()
      expect(getByTestId("app-alternate-phone-number")).toBeInTheDocument()
      expect(getByTestId("app-alternate-email")).toBeInTheDocument()
      expect(getByTestId("app-alternate-mailing-address-street")).toBeInTheDocument()
      expect(getByTestId("app-alternate-mailing-address-street2")).toBeInTheDocument()
      expect(getByTestId("app-alternate-mailing-address-city")).toBeInTheDocument()
      expect(getByTestId("app-alternate-mailing-address-state")).toBeInTheDocument()
      expect(getByTestId("app-alternate-mailing-address-zip")).toBeInTheDocument()
    })

    it("should require form input", async () => {
      const { getByText, findByText } = render(<ApplicationAlternateContactContact />)

      fireEvent.click(getByText("Next"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please enter a phone number")).toBeInTheDocument()
    })

    it("should disable fields and autofill alternate contact info for advocates", async () => {
      const { getByTestId, findByDisplayValue, profile } = renderWithAdvocate()
      const phoneField = within(getByTestId("app-alternate-phone-number")).getByRole("textbox")
      const emailField = getByTestId("app-alternate-email")
      const streetField = getByTestId("app-alternate-mailing-address-street")
      const street2Field = getByTestId("app-alternate-mailing-address-street2")
      const cityField = getByTestId("app-alternate-mailing-address-city")
      const stateField = getByTestId("app-alternate-mailing-address-state")
      const zipField = getByTestId("app-alternate-mailing-address-zip")

      await findByDisplayValue(profile.address.street)

      expect(phoneField).toBeDisabled()
      expect(emailField).toBeDisabled()
      expect(streetField).toBeDisabled()
      expect(street2Field).toBeDisabled()
      expect(cityField).toBeDisabled()
      expect(stateField).toBeDisabled()
      expect(zipField).toBeDisabled()

      expect(phoneField.getAttribute("value")?.replace(/\D/g, "")).toBe(profile.phoneNumber)
      expect(emailField).toHaveValue(profile.email)
      expect(streetField).toHaveValue(profile.address.street)
      expect(street2Field).toHaveValue(profile.address.street2)
      expect(cityField).toHaveValue(profile.address.city)
      expect(stateField).toHaveValue(profile.address.state)
      expect(zipField).toHaveValue(profile.address.zipCode)
    })
  })
})
