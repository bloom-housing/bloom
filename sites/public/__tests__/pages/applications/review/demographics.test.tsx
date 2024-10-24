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
      const { getByText, getByTestId, getAllByTestId, getByLabelText } = render(
        <ApplicationDemographics />
      )

      expect(getByText("Help us better serve you.")).toBeInTheDocument()
      expect(getByTestId("asian")).toBeInTheDocument()
      expect(getByTestId("black")).toBeInTheDocument()
      expect(getByTestId("indigenous")).toBeInTheDocument()
      expect(getByTestId("latino")).toBeInTheDocument()
      expect(getByTestId("middleEasternOrAfrican")).toBeInTheDocument()
      expect(getByTestId("pacificIslander")).toBeInTheDocument()
      expect(getByTestId("white")).toBeInTheDocument()
      expect(
        getByLabelText("Which language is most commonly spoken in your home? Please select one:")
      ).toBeInTheDocument()
      expect(
        getByLabelText("Which best describes your gender identity? Please select one:")
      ).toBeInTheDocument()
      expect(
        getByLabelText(
          "Which best describes your sexual orientation or sexual identity? Please select one:"
        )
      ).toBeInTheDocument()
      expect(getAllByTestId("app-demographics-how-did-you-hear")).toHaveLength(9)
    })

    it("should render sub demographics fields when parent is checked", () => {
      const { getByLabelText, queryByLabelText } = render(<ApplicationDemographics />)

      expect(queryByLabelText("Chinese")).not.toBeInTheDocument()
      expect(queryByLabelText("Filipino")).not.toBeInTheDocument()
      expect(queryByLabelText("Japanese")).not.toBeInTheDocument()
      expect(queryByLabelText("Korean")).not.toBeInTheDocument()
      expect(queryByLabelText("Mongolian")).not.toBeInTheDocument()
      expect(queryByLabelText("Vietnamese")).not.toBeInTheDocument()
      expect(queryByLabelText("Central Asian")).not.toBeInTheDocument()
      expect(queryByLabelText("South Asian")).not.toBeInTheDocument()
      expect(queryByLabelText("Southeast Asian")).not.toBeInTheDocument()
      expect(queryByLabelText("Other Asian")).not.toBeInTheDocument()

      fireEvent.click(getByLabelText("Asian"))

      expect(queryByLabelText("Chinese")).toBeInTheDocument()
      expect(queryByLabelText("Filipino")).toBeInTheDocument()
      expect(queryByLabelText("Japanese")).toBeInTheDocument()
      expect(queryByLabelText("Korean")).toBeInTheDocument()
      expect(queryByLabelText("Mongolian")).toBeInTheDocument()
      expect(queryByLabelText("Vietnamese")).toBeInTheDocument()
      expect(queryByLabelText("Central Asian")).toBeInTheDocument()
      expect(queryByLabelText("South Asian")).toBeInTheDocument()
      expect(queryByLabelText("Southeast Asian")).toBeInTheDocument()
      expect(queryByLabelText("Other Asian")).toBeInTheDocument()

      expect(queryByLabelText("African")).not.toBeInTheDocument()
      expect(queryByLabelText("African American")).not.toBeInTheDocument()
      expect(
        queryByLabelText("Caribbean, Central American, South American or Mexican")
      ).not.toBeInTheDocument()
      expect(queryByLabelText("Other Black")).not.toBeInTheDocument()

      fireEvent.click(getByLabelText("Black"))

      expect(queryByLabelText("African")).toBeInTheDocument()
      expect(queryByLabelText("African American")).toBeInTheDocument()
      expect(
        queryByLabelText("Caribbean, Central American, South American or Mexican")
      ).toBeInTheDocument()
      expect(queryByLabelText("Other Black")).toBeInTheDocument()

      expect(queryByLabelText("Alaskan Native")).not.toBeInTheDocument()
      expect(queryByLabelText("American Indian/Native American")).not.toBeInTheDocument()
      expect(
        queryByLabelText("Indigenous from Mexico, the Caribbean, Central America, or South America")
      ).not.toBeInTheDocument()
      expect(queryByLabelText("Other Indigenous")).not.toBeInTheDocument()

      fireEvent.click(getByLabelText("Indigenous"))

      expect(queryByLabelText("Alaskan Native")).toBeInTheDocument()
      expect(queryByLabelText("American Indian/Native American")).toBeInTheDocument()
      expect(
        queryByLabelText("Indigenous from Mexico, the Caribbean, Central America, or South America")
      ).toBeInTheDocument()
      expect(queryByLabelText("Other Indigenous")).toBeInTheDocument()

      expect(queryByLabelText("Caribbean")).not.toBeInTheDocument()
      expect(queryByLabelText("Central American")).not.toBeInTheDocument()
      expect(queryByLabelText("Mexican")).not.toBeInTheDocument()
      expect(queryByLabelText("South American")).not.toBeInTheDocument()
      expect(queryByLabelText("Other Latino")).not.toBeInTheDocument()

      fireEvent.click(getByLabelText("Latino"))

      expect(queryByLabelText("Caribbean")).toBeInTheDocument()
      expect(queryByLabelText("Central American")).toBeInTheDocument()
      expect(queryByLabelText("Mexican")).toBeInTheDocument()
      expect(queryByLabelText("South American")).toBeInTheDocument()
      expect(queryByLabelText("Other Latino")).toBeInTheDocument()

      expect(queryByLabelText("North African")).not.toBeInTheDocument()
      expect(queryByLabelText("West Asian")).not.toBeInTheDocument()
      expect(queryByLabelText("Other Middle Eastern or North African")).not.toBeInTheDocument()

      fireEvent.click(getByLabelText("Middle Eastern, West African or North African"))

      expect(queryByLabelText("North African")).toBeInTheDocument()
      expect(queryByLabelText("West Asian")).toBeInTheDocument()
      expect(queryByLabelText("Other Middle Eastern or North African")).toBeInTheDocument()

      expect(queryByLabelText("Chamorro")).not.toBeInTheDocument()
      expect(queryByLabelText("Native Hawaiian")).not.toBeInTheDocument()
      expect(queryByLabelText("Samoan")).not.toBeInTheDocument()
      expect(queryByLabelText("Other Pacific Islander")).not.toBeInTheDocument()

      fireEvent.click(getByLabelText("Pacific Islander"))

      expect(queryByLabelText("Chamorro")).toBeInTheDocument()
      expect(queryByLabelText("Native Hawaiian")).toBeInTheDocument()
      expect(queryByLabelText("Samoan")).toBeInTheDocument()
      expect(queryByLabelText("Other Pacific Islander")).toBeInTheDocument()
    })

    it("should show other text fields when other options are checked", async () => {
      const { getByLabelText, findAllByTestId } = render(<ApplicationDemographics />)

      fireEvent.click(getByLabelText("Asian"))
      expect(await findAllByTestId("asian-otherAsian")).toHaveLength(1)
      fireEvent.click(getByLabelText("Other Asian"))
      expect(await findAllByTestId("asian-otherAsian")).toHaveLength(2)

      fireEvent.click(getByLabelText("Black"))
      expect(await findAllByTestId("black-otherBlack")).toHaveLength(1)
      fireEvent.click(getByLabelText("Other Black"))
      expect(await findAllByTestId("black-otherBlack")).toHaveLength(2)

      fireEvent.click(getByLabelText("Indigenous"))
      expect(await findAllByTestId("indigenous-otherIndigenous")).toHaveLength(1)
      fireEvent.click(getByLabelText("Other Indigenous"))
      expect(await findAllByTestId("indigenous-otherIndigenous")).toHaveLength(2)

      fireEvent.click(getByLabelText("Latino"))
      expect(await findAllByTestId("latino-otherLatino")).toHaveLength(1)
      fireEvent.click(getByLabelText("Other Latino"))
      expect(await findAllByTestId("latino-otherLatino")).toHaveLength(2)

      fireEvent.click(getByLabelText("Middle Eastern, West African or North African"))
      expect(
        await findAllByTestId("middleEasternOrAfrican-otherMiddleEasternNorthAfrican")
      ).toHaveLength(1)
      fireEvent.click(getByLabelText("Other Middle Eastern or North African"))
      expect(
        await findAllByTestId("middleEasternOrAfrican-otherMiddleEasternNorthAfrican")
      ).toHaveLength(2)

      fireEvent.click(getByLabelText("Pacific Islander"))
      expect(await findAllByTestId("pacificIslander-otherPacificIslander")).toHaveLength(1)
      fireEvent.click(getByLabelText("Other Pacific Islander"))
      expect(await findAllByTestId("pacificIslander-otherPacificIslander")).toHaveLength(2)

      fireEvent.click(getByLabelText("White"))
      expect(await findAllByTestId("white-otherWhite")).toHaveLength(1)
      fireEvent.click(getByLabelText("Other White"))
      expect(await findAllByTestId("white-otherWhite")).toHaveLength(2)
    })
  })
})
