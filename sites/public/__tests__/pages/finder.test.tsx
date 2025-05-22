import React from "react"
import RentalsFinder from "../../src/components/finder/RentalsFinder"
import { render, screen } from "../testUtils"
import { mockNextRouter, within } from "../../../partners/__tests__/testUtils"
import userEvent from "@testing-library/user-event"
import { act } from "react-dom/test-utils"

beforeAll(() => {
  mockNextRouter()
})

describe("<RentalsFinder>", () => {
  it("renders all page elements", () => {
    render(<RentalsFinder />)

    // Check header content
    const finderHeaderTitle = screen.getByRole("heading", {
      name: /find listings for you/i,
      level: 1,
    })
    expect(finderHeaderTitle).toBeInTheDocument()

    const finderHeader = finderHeaderTitle.parentElement

    const [sectionOne, sectionTwo] = within(finderHeader).getAllByRole("listitem")
    expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
    expect(sectionOne).toHaveClass("is-active")
    expect(within(sectionTwo).getByText(/rent/i)).toBeInTheDocument()
    expect(sectionTwo).toHaveClass("is-disabled")

    const stepHeader = within(finderHeader).getByRole("heading", { level: 2 })
    expect(within(stepHeader).getByText(/housing needs/i)).toBeInTheDocument()
    expect(within(stepHeader).getByText(/of \d/i)).toBeInTheDocument()
    expect(within(stepHeader).getByText("1")).toBeInTheDocument()

    // Check question content
    expect(
      screen.getByRole("heading", { name: /how many bedrooms do you need\?/i, level: 2 })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/we'll use your selection to highlight possible rentals that match/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/select all that apply/i)).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /studio/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /1 bedroom/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /2 bedroom/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /3 bedroom/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /4 or more bedroom/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /skip this and show me listings/i })
    ).toBeInTheDocument()

    expect(screen.queryByRole("button", { name: /finish/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument()
  })

  it("should update content on next button click", async () => {
    render(<RentalsFinder />)

    const finderHeaderTitle = screen.getByRole("heading", {
      name: /find listings for you/i,
      level: 1,
    })
    expect(finderHeaderTitle).toBeInTheDocument()

    const finderHeader = finderHeaderTitle.parentElement

    const [sectionOne, sectionTwo] = within(finderHeader).getAllByRole("listitem")
    expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
    expect(sectionOne).toHaveClass("is-active")
    expect(within(sectionTwo).getByText(/rent/i)).toBeInTheDocument()
    expect(sectionTwo).toHaveClass("is-disabled")

    const stepHeader = within(finderHeader).getByRole("heading", { level: 2 })
    expect(within(stepHeader).getByText(/housing needs/i)).toBeInTheDocument()
    expect(within(stepHeader).getByText(/of \d/i)).toBeInTheDocument()
    expect(within(stepHeader).getByText("1")).toBeInTheDocument()

    const nextButton = screen.getByRole("button", { name: /next/i })
    expect(nextButton).toBeInTheDocument()
    await act(() => userEvent.click(nextButton))

    expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
    expect(sectionOne).toHaveClass("is-active")
    expect(within(sectionTwo).getByText(/rent/i)).toBeInTheDocument()
    expect(sectionTwo).toHaveClass("is-disabled")

    expect(within(stepHeader).getByText(/housing needs/i)).toBeInTheDocument()
    expect(within(stepHeader).getByText("1")).toBeInTheDocument()

    expect(
      screen.getByRole("heading", {
        name: /what areas would you like to live in\?/i,
        level: 2,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /we will use your selections to find you rentals that may match your housing needs./i
      )
    ).toBeInTheDocument()
    expect(screen.getByText(/select all that apply/i)).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /greater downtown/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /eastside/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /southwest/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /westside/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /skip this and show me listings/i })
    ).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /finish/i })).not.toBeInTheDocument()

    await act(() => userEvent.click(nextButton))

    expect(within(sectionOne).getByText(/housing needs/i)).toBeInTheDocument()
    expect(sectionOne).not.toHaveClass("is-active")
    expect(sectionOne).not.toHaveClass("is-disabled")
    expect(within(sectionTwo).getByText(/rent/i)).toBeInTheDocument()
    expect(sectionTwo).toHaveClass("is-active")

    expect(within(stepHeader).getByText(/rent/i)).toBeInTheDocument()
    expect(within(stepHeader).getByText("2")).toBeInTheDocument()

    expect(
      screen.getByRole("heading", { name: /how much rent can you afford to pay\?/i, level: 2 })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /we will use your selections to find you rentals that may match your housing needs./i
      )
    ).toBeInTheDocument()
    const minRentInput = screen.getByRole("textbox", { name: /minimum rent/i })
    expect(minRentInput).toBeInTheDocument()
    expect(minRentInput).toHaveAttribute("placeholder", "No Minimum Rent")
    const maxRentInput = screen.getByRole("textbox", { name: /minimum rent/i })
    expect(maxRentInput).toBeInTheDocument()
    expect(maxRentInput).toHaveAttribute("placeholder", "No Minimum Rent")
    expect(
      screen.getByRole("checkbox", {
        name: /include rentals that accept section 8 housing choice vouchers/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /finish/i })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()

    const backButton = screen.getByRole("button", { name: /back/i })
    expect(backButton).toBeInTheDocument()
    await act(() => userEvent.click(backButton))

    expect(
      screen.getByRole("heading", {
        name: /what areas would you like to live in\?/i,
        level: 2,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /we will use your selections to find you rentals that may match your housing needs./i
      )
    ).toBeInTheDocument()
  })
})
