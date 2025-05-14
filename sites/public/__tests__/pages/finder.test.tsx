import React from 'react'
import RentalsFinder from "../../src/components/finder/RentalsFinder"
import { render, screen } from "../testUtils"
import { mockNextRouter } from '../../../partners/__tests__/testUtils'
import userEvent from '@testing-library/user-event'

beforeAll(() => {
  mockNextRouter()
})

describe("<RentalsFinder>", () => {
  it("renders all page elements", () => {
    render(<RentalsFinder />)

    expect(screen.getByRole('heading', { name: /find listings for you/i, level: 3 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /how many bedrooms do you need\?/i, level: 3 })).toBeInTheDocument()
    expect(screen.getByText(/we'll use your selection to highlight possible rentals that match/i)).toBeInTheDocument()
    expect(screen.getByText(/select all that apply/i)).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /studio/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /1 bedroom/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /2 bedroom/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /3 bedroom/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /4 or more bedroom/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /skip this and show me listings/i })).toBeInTheDocument()

    expect(screen.queryByRole('button', { name: /finish/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument()
  })

  it("should update content on next button click", async () => {
    render(<RentalsFinder />)

    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).toBeInTheDocument()
    await userEvent.click(nextButton)

    expect(screen.getByRole('heading', { name: /what areas of Detroit would you like to live in\?/i, level: 3 })).toBeInTheDocument()
    expect(screen.getByText(/we will use your selections to find you rentals that may match your housing needs./i)).toBeInTheDocument()
    expect(screen.getByText(/select all that apply/i)).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /greater downtown/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /eastside/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /southwest/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /westside/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /finish/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /skip this and show me listings/i })).toBeInTheDocument()

        expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument()
  })
})