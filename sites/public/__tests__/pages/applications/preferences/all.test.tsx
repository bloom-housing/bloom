import React from "react"
import { setupServer } from "msw/lib/node"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationPreferencesAll from "../../../../src/pages/applications/preferences/all"

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

  describe("preferences all step", () => {
    it("should render page content", () => {
      const { getByText } = render(<ApplicationPreferencesAll />)

      expect(
        getByText("Your household may qualify for the following housing preferences.")
      ).toBeInTheDocument()
    })
  })
})
