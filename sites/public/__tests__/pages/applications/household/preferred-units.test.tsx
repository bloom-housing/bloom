import React from "react"
import { setupServer } from "msw/lib/node"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationPreferredUnits from "../../../../src/pages/applications/household/preferred-units"

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

  describe("preferred units step", () => {
    // TODO: We need to mock the units on the listing object, otherwise no unit types appear
    it("should render form fields", () => {
      const { getByText } = render(<ApplicationPreferredUnits />)

      expect(getByText("What unit sizes are you interested in?")).toBeInTheDocument()
      expect(getByText("Check all that apply")).toBeInTheDocument()
    })
  })
})
