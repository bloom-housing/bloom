import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationAddress from "../../../../src/pages/applications/contact/address"

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
      const { getByText, getByTestId } = render(<ApplicationAddress />)

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
    })

    it("should disable phone fields if user indicates they don't have a phone", async () => {
      const { getByText, findByTestId, getByTestId } = render(<ApplicationAddress />)

      expect(getByTestId("app-primary-phone-number").firstChild).toBeEnabled()
      fireEvent.click(getByText("I don't have a telephone number"))
      expect((await findByTestId("app-primary-phone-number")).firstChild).toBeDisabled()
      expect(await findByTestId("app-primary-phone-number-type")).toBeDisabled()
    })
  })
})
