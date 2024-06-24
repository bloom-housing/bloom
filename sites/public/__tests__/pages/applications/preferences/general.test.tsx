import React from "react"
import { setupServer } from "msw/lib/node"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationPreferencesGeneral from "../../../../src/pages/applications/preferences/general"

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

  describe("preferences general step", () => {
    it("should render page content", () => {
      const { getByText } = render(<ApplicationPreferencesGeneral />)

      expect(
        getByText(
          "Based on the information you have entered, your household has not claimed any housing preferences."
        )
      ).toBeInTheDocument()
    })
  })
})
