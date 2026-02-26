import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationAlternateContactName from "../../../../src/pages/applications/contact/alternate-contact-name"
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
  application.alternateContact.type = "caseManager"
  const profile = {
    ...user,
    firstName: "Advocate",
    lastName: "Person",
    agency: {
      id: "agency-id",
      name: "Advocate Agency",
    },
    isAdvocate: true,
    listings: [],
    jurisdictions: [],
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
        <ApplicationAlternateContactName />
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

  describe("alternate contact name step", () => {
    it("should render form fields", () => {
      const { getByText, getByTestId } = render(<ApplicationAlternateContactName />)

      expect(getByText("Who is your alternate contact?")).toBeInTheDocument()
      expect(getByTestId("app-alternate-first-name")).toBeInTheDocument()
      expect(getByTestId("app-alternate-last-name")).toBeInTheDocument()
    })

    it("should require form input", async () => {
      const { getByText, findByText } = render(<ApplicationAlternateContactName />)

      fireEvent.click(getByText("Next"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please enter a given name")).toBeInTheDocument()
      expect(getByText("Please enter a family name")).toBeInTheDocument()
    })

    it("should disable fields and autofill alternate contact name for advocates", async () => {
      const { getByTestId, findByDisplayValue, profile } = renderWithAdvocate()
      const firstNameField = getByTestId("app-alternate-first-name")
      const lastNameField = getByTestId("app-alternate-last-name")
      const agencyField = getByTestId("app-alternate-type")

      await findByDisplayValue(profile.firstName)

      expect(firstNameField).toBeDisabled()
      expect(lastNameField).toBeDisabled()
      expect(agencyField).toBeDisabled()

      expect(firstNameField).toHaveValue(profile.firstName)
      expect(lastNameField).toHaveValue(profile.lastName)
      expect(agencyField).toHaveValue(profile.agency.name)
    })
  })
})
