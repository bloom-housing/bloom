import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent } from "@testing-library/react"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationDemographics from "../../../../src/pages/applications/review/demographics"

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

  describe("demographics step", () => {
    it("should render form fields", () => {
      const { getByText, getByTestId, getAllByTestId } = render(<ApplicationDemographics />)

      expect(
        getByText("Help us ensure we are meeting our goal to serve all people.")
      ).toBeInTheDocument()
      expect(getByTestId("americanIndianAlaskanNative")).toBeInTheDocument()
      expect(getByTestId("asian")).toBeInTheDocument()
      expect(getByTestId("blackAfricanAmerican")).toBeInTheDocument()
      expect(getByTestId("nativeHawaiianOtherPacificIslander")).toBeInTheDocument()
      expect(getByTestId("white")).toBeInTheDocument()
      expect(getByTestId("otherMultiracial")).toBeInTheDocument()
      expect(getByTestId("declineToRespond")).toBeInTheDocument()
      expect(getByTestId("app-demographics-ethnicity")).toBeInTheDocument()
      expect(getAllByTestId("app-demographics-how-did-you-hear")).toHaveLength(9)
    })

    it("should render sub demographics fields when parent is checked", () => {
      const { getByText, queryByText } = render(<ApplicationDemographics />)

      expect(queryByText("Asian Indian")).not.toBeInTheDocument()
      expect(queryByText("Chinese")).not.toBeInTheDocument()
      expect(queryByText("Filipino")).not.toBeInTheDocument()
      expect(queryByText("Japanese")).not.toBeInTheDocument()
      expect(queryByText("Korean")).not.toBeInTheDocument()
      expect(queryByText("Vietnamese")).not.toBeInTheDocument()
      expect(queryByText("Other Asian")).not.toBeInTheDocument()

      fireEvent.click(getByText("Asian"))

      expect(getByText("Asian Indian")).toBeInTheDocument()
      expect(getByText("Chinese")).toBeInTheDocument()
      expect(getByText("Filipino")).toBeInTheDocument()
      expect(getByText("Japanese")).toBeInTheDocument()
      expect(getByText("Korean")).toBeInTheDocument()
      expect(getByText("Vietnamese")).toBeInTheDocument()
      expect(getByText("Other Asian")).toBeInTheDocument()

      expect(queryByText("Native Hawaiian")).not.toBeInTheDocument()
      expect(queryByText("Guamanian or Chamorro")).not.toBeInTheDocument()
      expect(queryByText("Samoan")).not.toBeInTheDocument()
      expect(queryByText("Other Pacific Islander")).not.toBeInTheDocument()

      fireEvent.click(getByText("Native Hawaiian / Other Pacific Islander"))

      expect(getByText("Native Hawaiian")).toBeInTheDocument()
      expect(getByText("Guamanian or Chamorro")).toBeInTheDocument()
      expect(getByText("Samoan")).toBeInTheDocument()
      expect(getByText("Other Pacific Islander")).toBeInTheDocument()
    })

    it("should show other text fields when other options are checked", async () => {
      const { getByText, queryByTitle, findByTitle } = render(<ApplicationDemographics />)

      expect(queryByTitle("asian-otherAsian")).not.toBeInTheDocument()
      fireEvent.click(getByText("Asian"))
      fireEvent.click(getByText("Other Asian"))
      expect(await findByTitle("asian-otherAsian")).toBeInTheDocument()

      expect(
        queryByTitle("nativeHawaiianOtherPacificIslander-otherPacificIslander")
      ).not.toBeInTheDocument()
      fireEvent.click(getByText("Native Hawaiian / Other Pacific Islander"))
      fireEvent.click(getByText("Other Pacific Islander"))
      expect(
        await findByTitle("nativeHawaiianOtherPacificIslander-otherPacificIslander")
      ).toBeInTheDocument()

      expect(queryByTitle("otherMultiracial")).not.toBeInTheDocument()
      fireEvent.click(getByText("Other / Multiracial"))
      expect(await findByTitle("otherMultiracial")).toBeInTheDocument()
    })
  })
})
