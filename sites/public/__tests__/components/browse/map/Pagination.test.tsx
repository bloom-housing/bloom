import React, { useState } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { Pagination } from "../../../../src/components/browse/map/Pagination"

const PaginationWrapper = ({ initialPage = 1, lastPage = 3 }) => {
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

  afterEach(() => {
    document.body.innerHTML = ""
    jest.clearAllMocks()
  })

  it("moves from page 1 to page 2 when the page button is clicked", () => {
    render(<PaginationWrapper initialPage={1} lastPage={3} />)

    expect(screen.getByRole("button", { name: "Current page, 1" })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }))

    expect(screen.getByRole("button", { name: "Current page, 2" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument()
  })

  it("shows next button on first page and previous button after advancing", () => {
    render(<PaginationWrapper initialPage={1} lastPage={3} />)

    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }))

    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })

  it("renders condensed pagination with ellipses for larger page counts", () => {
    render(<PaginationWrapper initialPage={5} lastPage={10} />)

    expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Current page, 5" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Go to page 10" })).toBeInTheDocument()
    expect(screen.getAllByText("...")).toHaveLength(2)
  })

  it("does not render pagination controls when there is only one page", () => {
    render(<PaginationWrapper initialPage={1} lastPage={1} />)

    expect(screen.queryByRole("navigation", { name: "Listings list pagination" })).toBeNull()
  })

  it("shows only a right ellipsis when current page is near the start", () => {
    render(<PaginationWrapper initialPage={2} lastPage={10} />)

    expect(screen.getByRole("button", { name: "Current page, 2" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Go to page 10" })).toBeInTheDocument()
    expect(screen.getAllByText("...")).toHaveLength(1)
  })

  it("shows only a left ellipsis when current page is near the end", () => {
    render(<PaginationWrapper initialPage={9} lastPage={10} />)

    expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Current page, 9" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Go to page 10" })).toBeInTheDocument()
    expect(screen.getAllByText("...")).toHaveLength(1)
  })

  it("scrolls list containers to top before changing page", () => {
    const onPageChange = jest.fn()
    const listingsList = document.createElement("div")
    listingsList.id = "listings-list"
    const containerScrollTo = jest.fn()
    Object.defineProperty(listingsList, "scrollTo", {
      writable: true,
      value: containerScrollTo,
    })
    document.body.appendChild(listingsList)

    render(<Pagination currentPage={1} lastPage={3} onPageChange={onPageChange} />)

    fireEvent.click(screen.getByRole("button", { name: "Next" }))

    expect(containerScrollTo).toHaveBeenCalledWith({ top: 0 })
    expect(window.scrollTo).not.toHaveBeenCalled()
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it("falls back to window scroll when list containers are not present", () => {
    const onPageChange = jest.fn()
    render(<Pagination currentPage={1} lastPage={3} onPageChange={onPageChange} />)

    fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }))

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 })
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
