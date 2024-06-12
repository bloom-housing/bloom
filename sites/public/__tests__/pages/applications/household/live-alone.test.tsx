import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationLiveAlone from "../../../../src/pages/applications/household/live-alone"

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

  describe("live alone step", () => {
    it("should render form fields", () => {
      const { getByText, getByTestId } = render(<ApplicationLiveAlone />)

      expect(
        getByText("Next we would like to know about the others who will live with you in the unit.")
      ).toBeInTheDocument()
      expect(getByTestId("app-household-live-alone")).toBeInTheDocument()
      expect(getByTestId("app-household-with-others")).toBeInTheDocument()
    })

    it("should require form input", async () => {
      const { getByText, findByText } = render(<ApplicationLiveAlone />)

      fireEvent.click(getByText("Next"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please select one of the options above.")).toBeInTheDocument()
    })
  })
})
