import React from "react"
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react"
import { AgTable, useAgTable } from "../../src/tables/AgTable"

const agTableMockColumns = [
  {
    headerName: "Name",
    field: "name",
  },
  {
    headerName: "Value",
    field: "value",
  },
]

const agTableMockData = Array.from({ length: 10 }).map((_, index) => ({
  name: `${index + 1} row`,
  value: `${index + 1}`,
}))

const getTableMockData = (page: number, perPage: number, search: string) => {
  // works by name only
  if (search) {
    return agTableMockData.filter((item) => item.name.includes(search))
  }

  if (page === 1) return agTableMockData.slice(0, perPage)
  if (page === 2) return agTableMockData.slice(perPage, agTableMockData.length)

  return agTableMockData
}

const AG_ROW_DOM_PATH = ".ag-center-cols-container > .ag-row"

const AgTableComponent = ({ loading }: { loading?: boolean }) => {
  const tableOptions = useAgTable()
  const tableItems = getTableMockData(
    tableOptions.pagination.currentPage,
    tableOptions.pagination.itemsPerPage,
    tableOptions.filter.filterValue
  )

  return (
    <AgTable
      id="test-table"
      pagination={{
        perPage: tableOptions.pagination.itemsPerPage,
        setPerPage: tableOptions.pagination.setItemsPerPage,
        currentPage: tableOptions.pagination.currentPage,
        setCurrentPage: tableOptions.pagination.setCurrentPage,
      }}
      config={{
        columns: agTableMockColumns,
        totalItemsLabel: "Total items",
      }}
      data={{
        items: tableItems,
        loading: loading || false,
        totalItems: agTableMockData.length,
        totalPages: Math.ceil(agTableMockData.length / tableOptions.pagination.itemsPerPage),
      }}
      search={{
        setSearch: tableOptions.filter.setFilterValue,
      }}
      sort={{
        setSort: tableOptions.sort.setSortOptions,
      }}
      headerContent={<div className="flex-row">right content</div>}
    />
  )
}

afterEach(cleanup)

describe("<AgTable>", () => {
  it("renders 8 rows by default", () => {
    const { container } = render(<AgTableComponent />)
    expect(container.querySelectorAll(AG_ROW_DOM_PATH).length).toBe(8)
  })

  it("navigates to the second page and renders 2 rows", async () => {
    const { container, getByText } = render(<AgTableComponent />)

    const nextBtn = getByText("Next")
    expect(nextBtn).toBeTruthy()
    fireEvent.click(nextBtn)

    await waitFor(() => {
      expect(container.querySelectorAll(AG_ROW_DOM_PATH).length).toBe(2)
    })
  })

  it("navigates to the previous page and renders 8 rows", async () => {
    const { container, getByTestId } = render(<AgTableComponent />)

    const prevBtn = getByTestId("ag-btn-prev")
    expect(prevBtn).toBeTruthy()
    fireEvent.click(prevBtn)

    await waitFor(() => {
      expect(container.querySelectorAll(AG_ROW_DOM_PATH).length).toBe(8)
    })
  })

  it("changes perPage to 10 and renders 10 rows", async () => {
    const { container, getByTestId } = render(<AgTableComponent />)

    const pageSizeSelect = getByTestId("ag-page-size")
    expect(pageSizeSelect).toBeTruthy()
    fireEvent.change(pageSizeSelect, { target: { value: 100 } })

    await waitFor(() => {
      expect(container.querySelectorAll(AG_ROW_DOM_PATH).length).toBe(10)
    })
  })

  it("changes page to 2 and renders 2 rows", async () => {
    const { container, getByTestId } = render(<AgTableComponent />)

    const pageSelect = getByTestId("ag-page-select")
    expect(pageSelect).toBeTruthy()
    fireEvent.change(pageSelect, { target: { value: 2 } })

    await waitFor(() => {
      expect(container.querySelectorAll(AG_ROW_DOM_PATH).length).toBe(2)
    })
  })

  it("filters results by '5 row' name", async () => {
    const { container, getByTestId } = render(<AgTableComponent />)

    const searchInput = getByTestId("ag-search-input")
    expect(searchInput).toBeTruthy()
    fireEvent.change(searchInput, { target: { value: "5 row" } })

    await waitFor(() => {
      expect(container.querySelectorAll(AG_ROW_DOM_PATH).length).toBe(1)
      expect(
        document.querySelector(".ag-center-cols-container > [row-id='0'] > [aria-colindex='1']")
      ).toContainHTML("5 row")
    })
  })

  it("renders loading overlay", async () => {
    const { getByTestId } = render(<AgTableComponent loading={true} />)

    const loadingOverlay = getByTestId("loading-overlay")
    expect(loadingOverlay).toBeTruthy()
  })
})
