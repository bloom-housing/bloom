import { act } from "react-dom/test-utils"
import { FormDemographics } from "../../../../src/components/applications/PaperApplicationForm/sections/FormDemographics"
import { mockNextRouter, render, screen } from "../../../testUtils"
import { FormProviderWrapper } from "./helpers"
import React from "react"
import userEvent from "@testing-library/user-event"

beforeAll(() => {
  mockNextRouter()
})

describe("<FormDemographics>", () => {
  it("renders the form with demographic information fields", () => {
    render(
      <FormProviderWrapper>
        <FormDemographics
          formValues={{
            id: "id",
            createdAt: new Date(),
            updatedAt: new Date(),
            race: [],
            howDidYouHear: [],
          }}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByText(/race/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/asian/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/black/i)).toBeInTheDocument()
    expect(
      screen.getByLabelText(/Middle Eastern, West African or North African/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/pacific islander/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/white/i)).toBeInTheDocument()

    expect(screen.queryByLabelText(/Chinese/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Filipino/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Japanese/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Korean/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Vietnamese/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Other Asian/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^Native Hawaiian$/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Guamanian or Chamorro/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Samoan/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^Other Pacific Islander$/i)).not.toBeInTheDocument()

    expect(screen.getByText(/how did you hear about us/i))
    expect(screen.getByLabelText(/bus ad/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email alert/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/flyer/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/friend/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/housing counselor/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^other$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/radio ad/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/government website/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/property website/i)).toBeInTheDocument()
  })

  it("should expand suboptions when main key is checked", async () => {
    render(
      <FormProviderWrapper>
        <FormDemographics
          formValues={{
            id: "id",
            createdAt: new Date(),
            updatedAt: new Date(),
            race: [],
            howDidYouHear: [],
          }}
        />
      </FormProviderWrapper>
    )

    const asianCheckbox = screen.getByLabelText(/asian/i)
    const latinoCheckbox = screen.getByLabelText(/latino/i)

    await act(async () => {
      await userEvent.click(asianCheckbox)
      await userEvent.click(latinoCheckbox)
    })

    expect(screen.getByLabelText(/Chinese/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Filipino/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Japanese/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Korean/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Mongolian/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Vietnamese/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Central Asian/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/South Asian/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Southeast Asian/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Other Asian/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Caribbean/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Central American/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Mexican/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/South American/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Other Latino/i)).toBeInTheDocument()
  })

  it("should show spoken language", async () => {
    render(
      <FormProviderWrapper>
        <FormDemographics
          formValues={{
            id: "id",
            createdAt: new Date(),
            updatedAt: new Date(),
            race: [],
            howDidYouHear: [],
          }}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByRole("combobox", { name: "Spoken Language" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Chinese - Cantonese" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Chinese - Mandarin" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "English" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Filipino" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Korean" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Russian" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Spanish" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Vietnamese" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Not Listed" })).toBeInTheDocument()
    expect(screen.queryAllByRole("textbox", { name: "Please specify:" })).toHaveLength(0)

    await act(async () => {
      await userEvent.selectOptions(
        screen.getByRole("combobox", { name: "Spoken Language" }),
        screen.getByRole("option", { name: "Not Listed" })
      )
    })

    expect(screen.getByRole("textbox", { name: "Please specify:" })).toBeInTheDocument()
  })
})
