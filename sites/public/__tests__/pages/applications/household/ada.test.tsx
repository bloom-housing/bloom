import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationAda from "../../../../src/pages/applications/household/ada"

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

  describe("ada step", () => {
    it("should render form fields", () => {
      const { getByText, getByTestId } = render(<ApplicationAda />)

      expect(
        getByText(
          "Do you or anyone in your household need any of the following ADA accessibility features?"
        )
      ).toBeInTheDocument()
      expect(getByTestId("app-ada-mobility")).toBeInTheDocument()
      expect(getByTestId("app-ada-vision")).toBeInTheDocument()
      expect(getByTestId("app-ada-hearing")).toBeInTheDocument()
      expect(getByTestId("app-ada-none")).toBeInTheDocument()
    })

    it("should require form input", async () => {
      const { getByText, findByText } = render(<ApplicationAda />)

      fireEvent.click(getByText("Next"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please select one of the options above.")).toBeInTheDocument()
    })

    it("should uncheck all other boxes when 'No' is selected", () => {
      const { getByText, getByTestId } = render(<ApplicationAda />)
      fireEvent.click(getByText("For Mobility Impairments"))
      fireEvent.click(getByText("For Vision Impairments"))
      fireEvent.click(getByText("For Hearing Impairments"))

      expect(getByTestId("app-ada-mobility")).toBeChecked()
      expect(getByTestId("app-ada-vision")).toBeChecked()
      expect(getByTestId("app-ada-hearing")).toBeChecked()
      expect(getByTestId("app-ada-none")).not.toBeChecked()

      fireEvent.click(getByText("No"))

      expect(getByTestId("app-ada-mobility")).not.toBeChecked()
      expect(getByTestId("app-ada-vision")).not.toBeChecked()
      expect(getByTestId("app-ada-hearing")).not.toBeChecked()
      expect(getByTestId("app-ada-none")).toBeChecked()
    })
  })
})
