import React from "react"
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/react"
import { t } from "@bloom-housing/ui-components"
import { ListingsSearchMetadata } from "../../../../src/components/browse/map/ListingsSearchMetadata"
import { useListingsMapContext } from "../../../../src/components/browse/map/ListingsMapContext"

jest.mock("../../../../src/components/browse/map/ListingsMapContext", () => ({
  useListingsMapContext: jest.fn(),
}))

describe("ListingsSearchMetadata", () => {
  const setListView = jest.fn()
  const setFilterDrawerOpen = jest.fn()

  const setInfoWindowIndex = jest.fn()

  const buildContext = (overrides = {}) => ({
    isLoading: false,
    setFilterDrawerOpen,
    setInfoWindowIndex,
    filterCount: 3,
    searchResults: {
      listings: [],
      markers: [],
      currentPage: 2,
      lastPage: 5,
      totalItems: 42,
    },
    setListView,
    listView: true,
    bedrooms: [],
    bathrooms: [],
    jurisdictions: [],
    multiselectData: [],
    searchFilter: {},
    isDesktop: true,
    setIsLoading: jest.fn(),
    visibleMarkers: [],
    setVisibleMarkers: jest.fn(),
    isFirstBoundsLoad: false,
    setIsFirstBoundsLoad: jest.fn(),
    onPageChange: jest.fn(),
    ...overrides,
  })

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useListingsMapContext as jest.Mock).mockReturnValue(buildContext())
  })

  it("toggles to map view when currently in list view", async () => {
    render(<ListingsSearchMetadata />)

    await userEvent.click(screen.getByRole("button", { name: t("t.mapMapView") }))

    expect(setListView).toHaveBeenCalledWith(false)
  })

  it("toggles to list view when currently in map view", async () => {
    ;(useListingsMapContext as jest.Mock).mockReturnValue(buildContext({ listView: false }))
    render(<ListingsSearchMetadata />)

    await userEvent.click(screen.getByRole("button", { name: t("t.mapListView") }))

    expect(setListView).toHaveBeenCalledWith(true)
  })

  it("opens filter drawer and closes info window from desktop and mobile filter buttons", async () => {
    render(<ListingsSearchMetadata />)

    const filterButtons = screen.getAllByRole("button", {
      name: new RegExp(t("search.filters"), "i"),
    })

    await userEvent.click(filterButtons[0])
    await userEvent.click(filterButtons[1])

    expect(setFilterDrawerOpen).toHaveBeenNthCalledWith(1, true)
    expect(setFilterDrawerOpen).toHaveBeenNthCalledWith(2, true)
    expect(setInfoWindowIndex).toHaveBeenNthCalledWith(1, null)
    expect(setInfoWindowIndex).toHaveBeenNthCalledWith(2, null)
  })

  it("renders total results and page metadata when not initial load", () => {
    render(<ListingsSearchMetadata />)

    expect(screen.getByText(t("search.totalResults"))).toBeInTheDocument()
    expect(screen.getByText("42")).toBeInTheDocument()
    expect(screen.getByText(/page\s*2\s*of\s*5/i)).toBeInTheDocument()
  })

  it("hides total results text during initial loading state", () => {
    ;(useListingsMapContext as jest.Mock).mockReturnValue(
      buildContext({
        isLoading: true,
        searchResults: {
          listings: [],
          markers: [],
          currentPage: 0,
          lastPage: 5,
          totalItems: 42,
        },
      })
    )

    render(<ListingsSearchMetadata />)

    expect(screen.queryByText(t("search.totalResults"))).not.toBeInTheDocument()
  })

  it("hides pagination metadata when lastPage is zero", () => {
    ;(useListingsMapContext as jest.Mock).mockReturnValue(
      buildContext({
        searchResults: {
          listings: [],
          markers: [],
          currentPage: 0,
          lastPage: 0,
          totalItems: 0,
        },
      })
    )

    render(<ListingsSearchMetadata />)

    expect(
      screen.queryByText(
        t("t.pageXofY", {
          current: 0,
          total: 0,
        })
      )
    ).not.toBeInTheDocument()
  })
})
