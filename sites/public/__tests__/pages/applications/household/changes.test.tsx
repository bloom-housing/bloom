import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationHouseholdChanges from "../../../../src/pages/applications/household/changes"

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

  describe("changes step", () => {
    it("should render form fields", () => {
      const { getByText, getAllByTestId } = render(<ApplicationHouseholdChanges />)

      expect(
        getByText(
          "Do you anticipate any changes in the number of people in your household in the next 12 months? If so, that may impact your eligibility for certain units."
        )
      ).toBeInTheDocument()
      expect(getAllByTestId("app-expecting-changes")).toHaveLength(2)
    })

    it("should require form input", async () => {
      const { getByText, findByText } = render(<ApplicationHouseholdChanges />)

      fireEvent.click(getByText("Next"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please select an option.")).toBeInTheDocument()
    })
  })
})
