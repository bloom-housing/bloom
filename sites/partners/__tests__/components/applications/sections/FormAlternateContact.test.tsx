import { render, screen } from "@testing-library/react"
import React from "react"
import { FormProviderWrapper } from "./helpers"
import { FormAlternateContact } from "../../../../src/components/applications/PaperApplicationForm/sections/FormAlternateContact"

describe("<FormAlternateContact>", () => {
  it("renders the form with alternate contact fields", () => {
    render(
      <FormProviderWrapper>
        <FormAlternateContact />
      </FormProviderWrapper>
    )

    expect(screen.getByRole("heading", { level: 2, name: /alternate contact/i }))
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/agency if applicable/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/relationship/i)).toBeInTheDocument()

    expect(screen.getByText(/mailing address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/apt or unit #/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument()
  })
})
