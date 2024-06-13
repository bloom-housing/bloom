import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationName from "../../../../src/pages/applications/contact/name"

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
      expect(getByText("Please enter a Given Name")).toBeInTheDocument()
      expect(getByText("Please enter a Family Name")).toBeInTheDocument()
      expect(
        getByText("Please enter a valid Date of Birth, must be 18 or older")
      ).toBeInTheDocument()
      expect(getByText("Please enter an email address")).toBeInTheDocument()
    })

    it("should disable email field if user indicates they don't have an email", async () => {
      const { getByText, findByTestId, getByTestId } = render(<ApplicationName />)

      expect(getByTestId("app-primary-email")).toBeEnabled()
      fireEvent.click(getByText("I don't have an email address"))
      expect(await findByTestId("app-primary-email")).toBeDisabled()
    })
  })
})
