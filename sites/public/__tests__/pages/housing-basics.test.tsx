import React from "react"
import { screen } from "@testing-library/dom"
import { act, mockNextRouter, render } from "../testUtils"
import userEvent from "@testing-library/user-event"
import HousingBasicsPage from "../../src/pages/housing-basics"

describe("HousingBasics", () => {
  beforeEach(() => {
    mockNextRouter()
  })
  it("should render the Housing Basics page", () => {
    render(<HousingBasicsPage />)
    expect(screen.getByRole("heading", { name: "Affordable housing basics" })).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Affordable housing video tutorials" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Learn more about the basics of affordable housing" })
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Contact" })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Detroit Home Connect: What is affordable housing?" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", {
        name: "Detroit Home Connect: Understanding income restrictions",
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Detroit Home Connect: Affordable housing waitlists" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Detroit Home Connect resident tutorial" })
    ).toBeInTheDocument()
  })

  it("should open all the Housing Basics modals", async () => {
    render(<HousingBasicsPage />)
    expect(screen.getByRole("heading", { name: "Affordable housing basics" })).toBeInTheDocument()

    // Detroit Home Connect: What is affordable housing?
    expect(
      screen.queryAllByRole("dialog", { name: "Detroit Home Connect: What is affordable housing?" })
    ).toHaveLength(0)
    await act(() =>
      userEvent.click(
        screen.getByRole("button", { name: "Detroit Home Connect: What is affordable housing?" })
      )
    )
    expect(
      screen.getByRole("dialog", { name: "Detroit Home Connect: What is affordable housing?" })
    ).toBeInTheDocument()
    await act(() => userEvent.click(screen.getByRole("button", { name: "Close" })))
    expect(
      screen.queryAllByRole("dialog", { name: "Detroit Home Connect: What is affordable housing?" })
    ).toHaveLength(0)

    // Detroit Home Connect: Understanding income restrictions
    await act(() =>
      userEvent.click(
        screen.getByRole("button", {
          name: "Detroit Home Connect: Understanding income restrictions",
        })
      )
    )
    expect(
      screen.getByRole("dialog", {
        name: "Detroit Home Connect: Understanding income restrictions",
      })
    ).toBeInTheDocument()
    await act(() => userEvent.click(screen.getByRole("button", { name: "Close" })))

    // Detroit Home Connect: Affordable housing waitlists
    await act(() =>
      userEvent.click(
        screen.getByRole("button", {
          name: "Detroit Home Connect: Affordable housing waitlists",
        })
      )
    )
    expect(
      screen.getByRole("dialog", {
        name: "Detroit Home Connect: Affordable housing waitlists",
      })
    ).toBeInTheDocument()
    await act(() => userEvent.click(screen.getByRole("button", { name: "Close" })))

    // Detroit Home Connect resident tutorial
    await act(() =>
      userEvent.click(
        screen.getByRole("button", {
          name: "Detroit Home Connect resident tutorial",
        })
      )
    )
    expect(
      screen.getByRole("dialog", {
        name: "Detroit Home Connect resident tutorial",
      })
    ).toBeInTheDocument()
    await act(() => userEvent.click(screen.getByRole("button", { name: "Close" })))
  })
})
