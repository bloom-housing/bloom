import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationTerms from "../../../../src/pages/applications/review/terms"

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

  describe("terms step", () => {
    it("should render form fields", () => {
      const { getByText, getByTestId } = render(<ApplicationTerms />)

      expect(getByText("Terms")).toBeInTheDocument()
      expect(getByTestId("app-terms-agree")).toBeInTheDocument()
    })

    it("should require form input", async () => {
      const { getByText, findByText } = render(<ApplicationTerms />)

      fireEvent.click(getByText("Submit"))
      expect(
        await findByText("You must agree to the terms in order to continue")
      ).toBeInTheDocument()
    })
  })
})
