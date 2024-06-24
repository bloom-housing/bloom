import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationHouseholdStudent from "../../../../src/pages/applications/household/student"

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

  describe("student step", () => {
    it("should render form fields", () => {
      const { getByText, getAllByTestId } = render(<ApplicationHouseholdStudent />)

      expect(
        getByText(
          "Is someone in your household a full time student or going to turn 18 years old within 60 days?"
        )
      ).toBeInTheDocument()
      expect(getAllByTestId("app-student")).toHaveLength(2)
    })

    it("should require form input", async () => {
      const { getByText, findByText } = render(<ApplicationHouseholdStudent />)

      fireEvent.click(getByText("Next"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please select an option.")).toBeInTheDocument()
    })
  })
})
