import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render, screen } from "../../../testUtils"
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
      render(<ApplicationHouseholdStudent />)

      expect(
        screen.getAllByText(
          "Is someone in your household a full time student or going to turn 18 years old within 60 days?"
        )
      ).toHaveLength(2)
      expect(screen.getAllByTestId("app-student")).toHaveLength(2)
    })

    it("should require form input", async () => {
      render(<ApplicationHouseholdStudent />)

      fireEvent.click(screen.getByText("Next"))
      expect(
        await screen.findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(screen.getByText("Please select an option.")).toBeInTheDocument()
    })
  })
})
