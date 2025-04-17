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
    expect(screen.getByLabelText(/american indian \/ alaskan native/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/asian/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/black \/ african american/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/native hawaiian \/ other pacific islander/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/white/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/other \/ multiracial/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/decline to respond/i)).toBeInTheDocument()

    expect(screen.queryByLabelText(/Asian Indian/i)).not.toBeInTheDocument()
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

    expect(screen.getByLabelText(/ethnicity/i)).toBeInTheDocument()

    expect(screen.getByText(/how did you hear about us/i))
    expect(screen.getByLabelText(/bus ad/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/developer website/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email alert/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/flyer/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/friend/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/housing counselor/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^other$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/radio ad/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/alameda county hcd website/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/government website/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/property website/i)).not.toBeInTheDocument()
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
    const hawaiianPacificCheckbox = screen.getByLabelText(
      /native hawaiian \/ other pacific islander/i
    )

    await act(async () => {
      await userEvent.click(asianCheckbox)
      await userEvent.click(hawaiianPacificCheckbox)
    })

    expect(screen.getByLabelText(/Asian Indian/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Chinese/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Filipino/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Japanese/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Korean/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Vietnamese/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Other Asian/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Native Hawaiian$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Guamanian or Chamorro/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Samoan/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Other Pacific Islander$/i)).toBeInTheDocument()
  })
})
