import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationVouchers from "../../../../src/pages/applications/financial/vouchers"

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

  describe("vouchers step", () => {
    it("should render form fields", () => {
      const { getByText, getAllByTestId } = render(<ApplicationVouchers />)

      expect(
        getByText(
          "Do you or anyone in your household receive Section 8 or Housing Authority issued vouchers, including Veterans Affairs Supportive Housing (VASH) vouchers, or rental assistance from other sources?"
        )
      ).toBeInTheDocument()
      expect(getAllByTestId("app-income-vouchers")).toHaveLength(3)
    })

    it("should require form input", async () => {
      const { getByText, findByText } = render(<ApplicationVouchers />)

      fireEvent.click(getByText("Next"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please select at least one option.")).toBeInTheDocument()
    })
  })
})
