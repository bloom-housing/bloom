import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationAlternateContactName from "../../../../src/pages/applications/contact/alternate-contact-name"

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
      expect(getByText("Please enter a Given Name")).toBeInTheDocument()
      expect(getByText("Please enter a Family Name")).toBeInTheDocument()
    })
  })
})
