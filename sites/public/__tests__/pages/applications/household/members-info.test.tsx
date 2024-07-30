import React from "react"
import { setupServer } from "msw/lib/node"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationMembersInfo from "../../../../src/pages/applications/household/members-info"

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

  describe("members info step", () => {
    it("should render page content", () => {
      const { getByText } = render(<ApplicationMembersInfo />)

      expect(
        getByText(
          "Before adding other people, make sure that they aren't named on any other application for this listing."
        )
      ).toBeInTheDocument()
    })
  })
})
