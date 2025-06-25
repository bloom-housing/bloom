import React from "react"
import { FormHouseholdIncome } from "../../../../src/components/applications/PaperApplicationForm/sections/FormHouseholdIncome"
import { act, mockNextRouter, render, screen } from "../../../testUtils"
import { FormProviderWrapper } from "./helpers"
import userEvent from "@testing-library/user-event"

beforeAll(() => {
  mockNextRouter()
})

describe("<FormHouseholdIncome>", () => {
  it("renders the form with household income fields", () => {
    render(
      <FormProviderWrapper>
        <FormHouseholdIncome />
      </FormProviderWrapper>
    )

    expect(screen.getByRole("heading", { level: 2, name: /declared household income/i }))
    expect(screen.getByText(/income period/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/per year/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/per month/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/annual income/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/monthly income/i)).toBeInTheDocument()
    // Note: this is the "Housing Voucher or Subsidy" question in core
    expect(screen.getByText("Issued Vouchers or Rental Assistance")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: /Section 8 or Housing Authority Issued Vouchers/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: /Rental assistance from other sources/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /None of the above/i })).toBeInTheDocument()
  })

  it("should disable income value fields until income period is selected", async () => {
    render(
      <FormProviderWrapper>
        <FormHouseholdIncome />
      </FormProviderWrapper>
    )

    const annualIncomeInput = screen.getByLabelText(/annual income/i)
    const monthlyIncomeInput = screen.getByLabelText(/monthly income/i)

    expect(annualIncomeInput).toBeDisabled()
    expect(monthlyIncomeInput).toBeDisabled()

    const perYearOption = screen.getByLabelText(/per year/i)
    const perMonthOption = screen.getByLabelText(/per month/i)

    await act(() => userEvent.click(perYearOption))

    expect(annualIncomeInput).toBeEnabled()
    expect(monthlyIncomeInput).toBeDisabled()

    await act(() => userEvent.click(perMonthOption))

    expect(annualIncomeInput).toBeDisabled()
    expect(monthlyIncomeInput).toBeEnabled()
  })
})
