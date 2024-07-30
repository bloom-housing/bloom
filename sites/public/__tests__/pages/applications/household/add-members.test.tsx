import React from "react"
import { setupServer } from "msw/lib/node"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationAddMembers from "../../../../src/pages/applications/household/add-members"

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

  describe("add members step", () => {
    it("should render form fields", () => {
      const { getByText } = render(<ApplicationAddMembers />)

      expect(getByText("Tell us about your household.")).toBeInTheDocument()
      expect(getByText("Edit")).toBeInTheDocument()
      expect(getByText("Add Household Member", { exact: false })).toBeInTheDocument()
    })
  })
})
