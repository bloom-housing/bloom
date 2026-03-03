import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationName from "../../../../src/pages/applications/contact/name"
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

  return render(
    <AuthContext.Provider
      value={{
        profile: {
          ...user,
          email: "advocate@example.com",
          isAdvocate: true,
          listings: [],
          jurisdictions: [],
        },
      }}
    >
      <AppSubmissionContext.Provider
        value={{
          conductor,
          application: blankApplication,
          listing,
          syncApplication: jest.fn(),
          syncListing: jest.fn(),
        }}
      >
        <ApplicationName />
      </AppSubmissionContext.Provider>
    </AuthContext.Provider>
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

  describe("name step", () => {
    it("should render form fields", () => {
      const { getByText, getByTestId } = render(<ApplicationName />)

      expect(getByText("What's your name?")).toBeInTheDocument()
      expect(getByTestId("app-primary-first-name")).toBeInTheDocument()
      expect(getByTestId("app-primary-middle-name")).toBeInTheDocument()
      expect(getByTestId("app-primary-last-name")).toBeInTheDocument()
      expect(getByTestId("dob-field-month")).toBeInTheDocument()
      expect(getByTestId("dob-field-day")).toBeInTheDocument()
      expect(getByTestId("dob-field-year")).toBeInTheDocument()
      expect(getByTestId("app-primary-email")).toBeInTheDocument()
    })

    it("should require form input", async () => {
      const { getByText, findByText } = render(<ApplicationName />)

      fireEvent.click(getByText("Next"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please enter a given name")).toBeInTheDocument()
      expect(getByText("Please enter a family name")).toBeInTheDocument()
      expect(
        getByText("Please enter a valid date of birth, must be 18 or older")
      ).toBeInTheDocument()
      expect(getByText("Please enter an email address")).toBeInTheDocument()
    })

    it("should disable email field if user indicates they don't have an email", async () => {
      const { getByText, findByTestId, getByTestId } = render(<ApplicationName />)

      expect(getByTestId("app-primary-email")).toBeEnabled()
      fireEvent.click(getByText("I don't have an email address"))
      expect(await findByTestId("app-primary-email")).toBeDisabled()
    })

    it("should show advocate warning and show error if advocate's own email is entered", async () => {
      const { getByTestId, getByText, findByText } = renderWithAdvocate()

      expect(
        getByText(/You are applying on behalf of a client; please enter your client’s information/i)
      ).toBeInTheDocument()
      expect(getByText(/not your own/i)).toBeInTheDocument()

      fireEvent.change(getByTestId("app-primary-email"), {
        target: { value: "advocate@example.com" },
      })
      fireEvent.click(getByText("Next"))

      expect(
        await findByText(
          "It looks like this email is associated with your account; please enter your client's email instead."
        )
      ).toBeInTheDocument()
    })
  })
})
