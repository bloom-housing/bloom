import { FormTerms } from "../../../../../src/components/applications/PaperApplicationForm/sections/FormTerms"
import { mockNextRouter, render, screen, FormProviderWrapper } from "../../../../testUtils"
import React from "react"

beforeAll(() => {
  mockNextRouter()
})

describe("<FormTerms>", () => {
  it("renders the form with terms fields", () => {
    render(
      <FormProviderWrapper>
        <FormTerms />
      </FormProviderWrapper>
    )

    expect(screen.getByRole("heading", { level: 2, name: /terms/i })).toBeInTheDocument()
    expect(screen.getByText(/signature on terms of agreement/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/yes/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/no/i)).toBeInTheDocument()
  })
})
