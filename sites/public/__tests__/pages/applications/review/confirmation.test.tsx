import React from "react"
import { setupServer } from "msw/lib/node"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationConfirmation from "../../../../src/pages/applications/review/confirmation"

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

  describe("confirmation step", () => {
    it("should render page content", () => {
      const { getByText } = render(<ApplicationConfirmation />)

      expect(
        getByText("Thanks. We have received your application", { exact: false })
      ).toBeInTheDocument()
      expect(
        getByText(
          "Please write down your application number and keep it in a safe place. We have also emailed this number to you if you have provided an email address."
        )
      ).toBeInTheDocument()
    })
  })
})
