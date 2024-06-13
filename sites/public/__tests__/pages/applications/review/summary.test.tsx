import React from "react"
import { setupServer } from "msw/lib/node"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationSummary from "../../../../src/pages/applications/review/summary"

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

  describe("summary step", () => {
    it("should render page content", () => {
      const { getByText } = render(<ApplicationSummary />)

      expect(
        getByText("Take a moment to review your information before submitting your application.")
      ).toBeInTheDocument()
    })
  })
})
