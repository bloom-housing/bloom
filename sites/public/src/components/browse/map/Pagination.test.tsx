import React, { useState } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { Pagination } from "./Pagination"

const PaginationHarness = ({ initialPage = 1, lastPage = 3 }) => {
  const [currentPage, setCurrentPage] = useState(initialPage)

  return <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={setCurrentPage} />
}

describe("Pagination", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollTo", {
      writable: true,
      value: jest.fn(),
    })
  })

  it("moves from page 1 to page 2 when the page button is clicked", () => {
    render(<PaginationHarness initialPage={1} lastPage={3} />)

    expect(screen.getByRole("button", { name: "Current page, 1" })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }))

    expect(screen.getByRole("button", { name: "Current page, 2" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument()
  })

  it("shows next button on first page and previous button after advancing", () => {
    render(<PaginationHarness initialPage={1} lastPage={3} />)

    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }))

    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })

  it("renders condensed pagination with ellipses for larger page counts", () => {
    render(<PaginationHarness initialPage={5} lastPage={10} />)

    expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Current page, 5" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Go to page 10" })).toBeInTheDocument()
    expect(screen.getAllByText("...")).toHaveLength(2)
  })
})
