import React from "react"
import { render, cleanup, screen, within, fireEvent } from "@testing-library/react"
import { DataTable, TableDataRow } from "../../../src/components/shared/DataTable"
import { createColumnHelper } from "@tanstack/react-table"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

afterEach(cleanup)

const queryClient = new QueryClient()

describe("DataTable", () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
  })

  it("renders one row without error", async () => {
    const columnHelper = createColumnHelper<TableDataRow>()

    const columns = [
      columnHelper.accessor("firstName", {
        id: "firstName",
        cell: (props) => props.getValue(),
        header: () => "First name",
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      }),
      columnHelper.accessor("lastName", {
        id: "lastName",
        cell: (props) => props.getValue(),
        header: () => "Last name",
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      }),
    ]
    const mockFetch = jest.fn()

    mockFetch.mockReturnValue({
      items: [{ firstName: "TestFirst", lastName: "TestLast" }],
      totalItems: 1,
      errorMessage: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <DataTable columns={columns} fetchData={mockFetch} />
      </QueryClientProvider>
    )
    expect(await screen.findByRole("columnheader", { name: "First name" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Last name" })).toBeInTheDocument()
    // Number of rows outside the header
    expect(within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row")).toHaveLength(1)
    expect(screen.getByRole("cell", { name: "TestFirst" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestLast" })).toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: "Activate ascending sort" })).toHaveLength(2)
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled()
    expect(screen.getByRole("combobox", { name: "Show" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "8" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "25" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "50" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "100" })).toBeInTheDocument()
    expect(screen.getByText("1 Total listing")).toBeInTheDocument()
  })

  it("can navigate forward and backward with pagination", async () => {
    const columnHelper = createColumnHelper<TableDataRow>()

    const columns = [
      columnHelper.accessor("firstName", {
        id: "firstName",
        cell: (props) => props.getValue(),
        header: () => "First name",
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      }),
      columnHelper.accessor("lastName", {
        id: "lastName",
        cell: (props) => props.getValue(),
        header: () => "Last name",
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      }),
    ]
    const mockFetch = jest.fn()

    mockFetch.mockReturnValueOnce({
      items: [
        { firstName: "TestFirst1", lastName: "TestLast1" },
        { firstName: "TestFirst2", lastName: "TestLast2" },
      ],
      totalItems: 5,
      errorMessage: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <DataTable columns={columns} fetchData={mockFetch} defaultItemsPerPage={2} />
      </QueryClientProvider>
    )
    expect(await screen.findByRole("columnheader", { name: "First name" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Last name" })).toBeInTheDocument()
    expect(screen.getByText("5 Total listings")).toBeInTheDocument()

    // Number of rows outside the header
    expect(within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row")).toHaveLength(2)
    expect(screen.getByRole("cell", { name: "TestFirst1" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestLast1" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestFirst2" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestLast2" })).toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: "Activate ascending sort" })).toHaveLength(2)

    const nextButton = screen.getByRole("button", { name: "Next" })
    const previousButton = screen.getByRole("button", { name: "Previous" })

    expect(nextButton).toBeEnabled()
    expect(previousButton).toBeDisabled()
    mockFetch.mockReturnValueOnce({
      items: [
        { firstName: "TestFirst3", lastName: "TestLast3" },
        { firstName: "TestFirst4", lastName: "TestLast4" },
      ],
      totalItems: 5,
      errorMessage: null,
    })
    fireEvent.click(nextButton)
    expect(mockFetch).toHaveBeenCalledTimes(2)

    expect(await screen.findByRole("cell", { name: "TestFirst3" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestLast3" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestFirst4" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestLast4" })).toBeInTheDocument()
    expect(within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row")).toHaveLength(2)
    expect(nextButton).toBeEnabled()
    expect(previousButton).toBeEnabled()
    mockFetch.mockReturnValueOnce({
      items: [{ firstName: "TestFirst5", lastName: "TestLast5" }],
      totalItems: 5,
      errorMessage: null,
    })
    fireEvent.click(nextButton)
    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(await screen.findByRole("cell", { name: "TestFirst5" })).toBeInTheDocument()
    expect(within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row")).toHaveLength(1)
    expect(screen.getByRole("cell", { name: "TestLast5" })).toBeInTheDocument()
    expect(nextButton).toBeDisabled()
    expect(previousButton).toBeEnabled()

    mockFetch.mockReturnValueOnce({
      items: [
        { firstName: "TestFirst3", lastName: "TestLast3" },
        { firstName: "TestFirst4", lastName: "TestLast4" },
      ],
      totalItems: 5,
      errorMessage: null,
    })
    fireEvent.click(previousButton)
    expect(mockFetch).toHaveBeenCalledTimes(4)
    expect(await screen.findByRole("cell", { name: "TestFirst3" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestLast3" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestFirst4" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestLast4" })).toBeInTheDocument()
    expect(within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row")).toHaveLength(2)
  })
  it.todo("filtering, and columns without a filter")
  it.todo("sorting, and columns without a sort that have no icon")
  it.todo("hiding columns")
  it.todo("empty state")
  it.todo("error message")
  it.todo("page size change")
})
