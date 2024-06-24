import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationIncome from "../../../../src/pages/applications/financial/income"

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

  describe("income step", () => {
    it("should render form fields", () => {
      const { getByText, getByTestId, getAllByTestId } = render(<ApplicationIncome />)

      expect(getByText("Let's move to income.")).toBeInTheDocument()
      expect(getByTestId("app-income")).toBeInTheDocument()
      expect(getAllByTestId("app-income-period")).toHaveLength(2)
    })

    it("should require form input", async () => {
      const { getByText, findByText } = render(<ApplicationIncome />)

      fireEvent.click(getByText("Next"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please enter a valid number greater than 0.")).toBeInTheDocument()
      expect(getByText("Please select one of the options above.")).toBeInTheDocument()
    })
  })
})
