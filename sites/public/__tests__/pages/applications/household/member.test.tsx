import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationMember from "../../../../src/pages/applications/household/member"

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

  describe("member step", () => {
    it("should render form fields", () => {
      const { getByText, getByTestId, getAllByTestId } = render(<ApplicationMember />)

      expect(getByText("Tell us about this person.")).toBeInTheDocument()
      expect(getByTestId("app-household-member-first-name")).toBeInTheDocument()
      expect(getByTestId("app-household-member-first-name")).toBeInTheDocument()
      expect(getByTestId("app-household-member-first-name")).toBeInTheDocument()
      expect(getByTestId("dob-field-month")).toBeInTheDocument()
      expect(getByTestId("dob-field-day")).toBeInTheDocument()
      expect(getByTestId("dob-field-year")).toBeInTheDocument()
      expect(getAllByTestId("app-household-member-same-address")).toHaveLength(2)
      expect(getAllByTestId("app-household-member-work-in-region")).toHaveLength(2)
      expect(getByTestId("app-household-member-relationship")).toBeInTheDocument()
    })

    it("should require form input", async () => {
      const { getByText, findByText, getAllByText } = render(<ApplicationMember />)

      fireEvent.click(getByText("Save household member"))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(getByText("Please enter a Given Name")).toBeInTheDocument()
      expect(getByText("Please enter a Family Name")).toBeInTheDocument()
      expect(getByText("Please enter a valid Date of Birth")).toBeInTheDocument()
      expect(getAllByText("Please select one of the options above.")).toHaveLength(3)
    })

    it("should show more address fields if same address is not selected", () => {
      const { getAllByText, getByTestId } = render(<ApplicationMember />)

      fireEvent.click(getAllByText("No")[0])
      expect(getByTestId("app-household-member-address-street")).toBeInTheDocument()
      expect(getByTestId("app-household-member-address-street2")).toBeInTheDocument()
      expect(getByTestId("app-household-member-address-city")).toBeInTheDocument()
      expect(getByTestId("app-household-member-address-state")).toBeInTheDocument()
      expect(getByTestId("app-household-member-address-zip")).toBeInTheDocument()
    })

    it("should show more address fields if work in region is selected", () => {
      const { getAllByText, getByTestId } = render(<ApplicationMember />)

      fireEvent.click(getAllByText("Yes")[1])
      expect(getByTestId("app-household-member-work-address-street")).toBeInTheDocument()
      expect(getByTestId("app-household-member-work-address-street2")).toBeInTheDocument()
      expect(getByTestId("app-household-member-work-address-city")).toBeInTheDocument()
      expect(getByTestId("app-household-member-work-address-state")).toBeInTheDocument()
      expect(getByTestId("app-household-member-work-address-zip")).toBeInTheDocument()
    })
  })
})
