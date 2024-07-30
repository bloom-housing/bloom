import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationAlternateContactContact from "../../../../src/pages/applications/contact/alternate-contact-contact"

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
  })
})
