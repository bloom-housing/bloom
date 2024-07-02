import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationAlternateContactType from "../../../../src/pages/applications/contact/alternate-contact-type"

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

  describe("alternate contact type step", () => {
    it("should render form fields", () => {
      const { getByText, getAllByTestId } = render(<ApplicationAlternateContactType />)

      expect(
        getByText(
          "Is there someone else you'd like to authorize us to contact if we can't reach you?"
        )
      ).toBeInTheDocument()
      expect(getAllByTestId("app-alternate-type")).toHaveLength(5)
    })

    it("should require form input", async () => {
      const { getByText, findByText } = render(<ApplicationAlternateContactType />)

      fireEvent.click(getByText("Next"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please select an alternate contact")).toBeInTheDocument()
    })

    it("should enable additional text field if user selects other type", () => {
      const { getByText, getByTestId, queryByText } = render(<ApplicationAlternateContactType />)

      expect(queryByText("app-alternate-other-type")).not.toBeInTheDocument()
      fireEvent.click(getByText("Other"))
      expect(getByTestId("app-alternate-other-type")).toBeInTheDocument()
    })
  })
})
