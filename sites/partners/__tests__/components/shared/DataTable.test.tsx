import React from "react"
import { render, cleanup, screen, within, fireEvent } from "@testing-library/react"
import { DataTable, TableDataRow } from "../../../src/components/shared/DataTable"
import { createColumnHelper } from "@tanstack/react-table"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

afterEach(cleanup)

const queryClient = new QueryClient()

describe("DataTable", () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn()

  const columnHelper = createColumnHelper<TableDataRow>()

  const defaultColumns = [
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

  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
  })

  it("should render one row without error", async () => {
    const mockFetch = jest.fn()

    mockFetch.mockReturnValue({
      items: [{ firstName: "TestFirst", lastName: "TestLast" }],
      totalItems: 1,
      currentPage: 1,
      itemsPerPage: 8,
      errorMessage: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <DataTable
          columns={defaultColumns}
          fetchData={mockFetch}
          description={"Table caption"}
          filterType={"per-column"}
        />
      </QueryClientProvider>
    )
    expect(await screen.findByRole("columnheader", { name: "First name" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Last name" })).toBeInTheDocument()
    // Number of rows outside the header
    expect(within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row")).toHaveLength(1)
    expect(screen.getByRole("cell", { name: "TestFirst" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestLast" })).toBeInTheDocument()
    expect(screen.getByTestId("sort-button-firstName")).toBeInTheDocument()
    expect(screen.getByTestId("sort-button-lastName")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled()
    expect(screen.getByRole("combobox", { name: "Show" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "8" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "25" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "50" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "100" })).toBeInTheDocument()
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument()
    expect(screen.getByText("1 Total listing")).toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
  })

  it("should navigate forward and backward with pagination", async () => {
    const mockFetch = jest.fn()

    mockFetch.mockReturnValueOnce({
      items: [
        { firstName: "TestFirst1", lastName: "TestLast1" },
        { firstName: "TestFirst2", lastName: "TestLast2" },
      ],
      totalItems: 5,
      currentPage: 1,
      itemsPerPage: 2,
      errorMessage: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <DataTable
          columns={defaultColumns}
          fetchData={mockFetch}
          defaultItemsPerPage={2}
          description={"Table caption"}
          filterType={"per-column"}
        />
      </QueryClientProvider>
    )
    expect(await screen.findByRole("columnheader", { name: "First name" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Last name" })).toBeInTheDocument()
    expect(screen.getByText("5 Total listings")).toBeInTheDocument()

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 2 }, [], [])

    // Number of rows outside the header
    expect(within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row")).toHaveLength(2)
    expect(screen.getByRole("cell", { name: "TestFirst1" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestLast1" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestFirst2" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestLast2" })).toBeInTheDocument()
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument()

    expect(screen.getByTestId("sort-button-firstName")).toBeInTheDocument()
    expect(screen.getByTestId("sort-button-lastName")).toBeInTheDocument()

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
      currentPage: 2,
      itemsPerPage: 2,
      errorMessage: null,
    })
    fireEvent.click(nextButton)
    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(mockFetch).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 2 }, [], [])

    expect(await screen.findByRole("cell", { name: "TestFirst3" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestLast3" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestFirst4" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestLast4" })).toBeInTheDocument()
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument()

    expect(within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row")).toHaveLength(2)
    expect(nextButton).toBeEnabled()
    expect(previousButton).toBeEnabled()
    mockFetch.mockReturnValueOnce({
      items: [{ firstName: "TestFirst5", lastName: "TestLast5" }],
      totalItems: 5,
      currentPage: 3,
      itemsPerPage: 2,
      errorMessage: null,
    })
    fireEvent.click(nextButton)
    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(mockFetch).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 2 }, [], [])

    expect(await screen.findByRole("cell", { name: "TestFirst5" })).toBeInTheDocument()
    expect(within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row")).toHaveLength(1)
    expect(screen.getByRole("cell", { name: "TestLast5" })).toBeInTheDocument()
    expect(screen.getByText("Page 3 of 3")).toBeInTheDocument()
    expect(nextButton).toBeDisabled()
    expect(previousButton).toBeEnabled()
    mockFetch.mockReturnValueOnce({
      items: [
        { firstName: "TestFirst3", lastName: "TestLast3" },
        { firstName: "TestFirst4", lastName: "TestLast4" },
      ],
      totalItems: 5,
      currentPage: 2,
      itemsPerPage: 2,
      errorMessage: null,
    })
    fireEvent.click(previousButton)
    expect(mockFetch).toHaveBeenCalledTimes(4)
    expect(mockFetch).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 2 }, [], [])
    expect(await screen.findByRole("cell", { name: "TestFirst3" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestLast3" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestFirst4" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "TestLast4" })).toBeInTheDocument()
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument()
    expect(within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row")).toHaveLength(2)
  })
  it("should filter on columns per-column", async () => {
    const mockFetch = jest.fn()

    const defaultItems = [
      { firstName: "TestFirstA", lastName: "TestLastA" },
      { firstName: "TestFirstB", lastName: "TestLastB" },
      { firstName: "TestFirstC", lastName: "TestLastC" },
      { firstName: "TestFirstD", lastName: "TestLastD" },
      { firstName: "TestFirstE", lastName: "TestLastE" },
      { firstName: "TestFirstF", lastName: "TestLastF" },
      { firstName: "TestFirstG", lastName: "TestLastG" },
      { firstName: "TestFirstH", lastName: "TestLastH" },
    ]
    mockFetch.mockReturnValue({
      items: defaultItems,
      totalItems: 8,
      currentPage: 1,
      itemsPerPage: 8,
      errorMessage: null,
    })

    const filterColumns = [
      columnHelper.accessor("firstName", {
        id: "firstName",
        cell: (props) => props.getValue(),
        header: () => "First name",
        footer: (props) => props.column.id,
        enableSorting: false,
        meta: { plaintextName: "First name" },
      }),
      columnHelper.accessor("lastName", {
        id: "lastName",
        cell: (props) => props.getValue(),
        header: () => "Last name",
        footer: (props) => props.column.id,
        enableSorting: false,
        enableColumnFilter: false,
        meta: { plaintextName: "Last name" },
      }),
    ]

    render(
      <QueryClientProvider client={queryClient}>
        <DataTable
          columns={filterColumns}
          fetchData={mockFetch}
          minSearchCharacters={5}
          filterType={"per-column"}
          description={"Table caption"}
        />
      </QueryClientProvider>
    )

    expect(await screen.findByRole("columnheader", { name: /First name/i })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: /Last name/i })).toBeInTheDocument()
    expect(screen.getByText("8 Total listings")).toBeInTheDocument()
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument()

    expect(screen.queryByRole("button", { description: "Activate ascending sort" })).toBeNull()
    const firstNameInput = screen.getByTestId("column-search-First name")
    expect(firstNameInput).toHaveAccessibleDescription(
      "Search items by First name - Enter at least 5 characters"
    )
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 8 }, [], [])

    fireEvent.change(firstNameInput, { target: { value: "Te" } })
    expect(mockFetch).toHaveBeenCalledTimes(1)

    mockFetch.mockReturnValueOnce({
      items: [{ firstName: "TestFirstA", lastName: "TestLastA" }],
      totalItems: 1,
      currentPage: 1,
      itemsPerPage: 8,
      errorMessage: null,
    })
    fireEvent.change(firstNameInput, { target: { value: "TestFirstA" } })
    expect(await screen.findByText("1 Total listing")).toBeInTheDocument()
    expect(await screen.findByRole("cell", { name: "TestFirstA" })).toBeInTheDocument()
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument()
    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(mockFetch).toHaveBeenCalledWith(
      { pageIndex: 0, pageSize: 8 },
      [{ id: "firstName", value: "TestFirstA" }],
      []
    )

    mockFetch.mockReturnValueOnce({
      items: defaultItems,
      totalItems: 8,
      currentPage: 1,
      itemsPerPage: 8,
      errorMessage: null,
    })
    fireEvent.change(firstNameInput, { target: { value: "Te" } })
    expect(await screen.findByText("8 Total listings")).toBeInTheDocument()
    expect(await screen.findByRole("cell", { name: "TestFirstB" })).toBeInTheDocument()
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument()
    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(mockFetch).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 8 }, [], [])
  })

  it("should filter on columns  global", async () => {
    const mockFetch = jest.fn()

    const defaultItems = [
      { firstName: "TestFirstA", lastName: "TestLastA" },
      { firstName: "TestFirstB", lastName: "TestLastB" },
      { firstName: "TestFirstC", lastName: "TestLastC" },
      { firstName: "TestFirstD", lastName: "TestLastD" },
      { firstName: "TestFirstE", lastName: "TestLastE" },
      { firstName: "TestFirstF", lastName: "TestLastF" },
      { firstName: "TestFirstG", lastName: "TestLastG" },
      { firstName: "TestFirstH", lastName: "TestLastH" },
    ]
    mockFetch.mockReturnValue({
      items: defaultItems,
      totalItems: 8,
      currentPage: 1,
      itemsPerPage: 8,
      errorMessage: null,
    })

    const filterColumns = [
      columnHelper.accessor("firstName", {
        id: "firstName",
        cell: (props) => props.getValue(),
        header: () => "First name",
        footer: (props) => props.column.id,
        enableSorting: false,
        meta: { plaintextName: "First name" },
      }),
      columnHelper.accessor("lastName", {
        id: "lastName",
        cell: (props) => props.getValue(),
        header: () => "Last name",
        footer: (props) => props.column.id,
        enableSorting: false,
        enableColumnFilter: false,
        meta: { plaintextName: "Last name" },
      }),
    ]

    render(
      <QueryClientProvider client={queryClient}>
        <DataTable
          columns={filterColumns}
          fetchData={mockFetch}
          minSearchCharacters={5}
          filterType={"global"}
          description={"Table caption"}
        />
      </QueryClientProvider>
    )

    expect(await screen.findByRole("columnheader", { name: /First name/i })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: /Last name/i })).toBeInTheDocument()
    expect(screen.getByText("8 Total listings")).toBeInTheDocument()
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument()

    expect(screen.queryByRole("button", { description: "Activate ascending sort" })).toBeNull()
    const firstNameInput = screen.getByTestId("column-search-global-search")
    expect(firstNameInput).toHaveAccessibleDescription("Search items - Enter at least 5 characters")
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 8 }, null, [])

    fireEvent.change(firstNameInput, { target: { value: "Te" } })
    expect(mockFetch).toHaveBeenCalledTimes(1)

    mockFetch.mockReturnValueOnce({
      items: [{ firstName: "TestFirstA", lastName: "TestLastA" }],
      totalItems: 1,
      currentPage: 1,
      itemsPerPage: 8,
      errorMessage: null,
    })
    fireEvent.change(firstNameInput, { target: { value: "TestFirstA" } })
    expect(await screen.findByText("1 Total listing")).toBeInTheDocument()
    expect(await screen.findByRole("cell", { name: "TestFirstA" })).toBeInTheDocument()
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument()
    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(mockFetch).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 8 }, "TestFirstA", [])

    mockFetch.mockReturnValueOnce({
      items: defaultItems,
      totalItems: 8,
      currentPage: 1,
      itemsPerPage: 8,
      errorMessage: null,
    })
    fireEvent.change(firstNameInput, { target: { value: "Te" } })
    expect(await screen.findByText("8 Total listings")).toBeInTheDocument()
    expect(await screen.findByRole("cell", { name: "TestFirstB" })).toBeInTheDocument()
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument()
    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(mockFetch).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 8 }, "", [])
  })
  it("should sort on columns", async () => {
    const mockFetch = jest.fn()

    const defaultItems = [
      { firstName: "TestFirstA", middleName: "TestMiddleA", lastName: "TestLastA" },
      { firstName: "TestFirstB", middleName: "TestMiddleB", lastName: "TestLastB" },
      { firstName: "TestFirstC", middleName: "TestMiddleC", lastName: "TestLastC" },
      { firstName: "TestFirstD", middleName: "TestMiddleD", lastName: "TestLastD" },
      { firstName: "TestFirstE", middleName: "TestMiddleE", lastName: "TestLastE" },
      { firstName: "TestFirstF", middleName: "TestMiddleF", lastName: "TestLastF" },
      { firstName: "TestFirstG", middleName: "TestMiddleG", lastName: "TestLastG" },
      { firstName: "TestFirstH", middleName: "TestMiddleH", lastName: "TestLastH" },
    ]

    mockFetch.mockReturnValue({
      items: defaultItems,
      totalItems: 8,
      currentPage: 1,
      itemsPerPage: 8,
      errorMessage: null,
    })

    const sortColumns = [
      columnHelper.accessor("firstName", {
        id: "firstName",
        cell: (props) => props.getValue(),
        header: () => "First name",
        footer: (props) => props.column.id,
        enableSorting: true,
        enableColumnFilter: false,
        meta: { plaintextName: "First name" },
      }),
      columnHelper.accessor("middleName", {
        id: "middleName",
        cell: (props) => props.getValue(),
        header: () => "Middle name",
        footer: (props) => props.column.id,
        enableSorting: true,
        enableColumnFilter: false,
        meta: { plaintextName: "Middle name" },
      }),
      columnHelper.accessor("lastName", {
        id: "lastName",
        cell: (props) => props.getValue(),
        header: () => "Last name",
        footer: (props) => props.column.id,
        enableSorting: true,
        enableColumnFilter: false,
        meta: { plaintextName: "Last name" },
      }),
    ]

    render(
      <QueryClientProvider client={queryClient}>
        <DataTable
          columns={sortColumns}
          fetchData={mockFetch}
          minSearchCharacters={5}
          initialSort={[{ id: "lastName", desc: false }]}
          description={"Table caption"}
          filterType={"per-column"}
        />
      </QueryClientProvider>
    )

    expect(await screen.findByRole("columnheader", { name: "First name" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Last name" })).toBeInTheDocument()
    expect(screen.getByText("8 Total listings")).toBeInTheDocument()
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument()

    expect(screen.getByTestId("sort-button-firstName")).toHaveAccessibleDescription(
      "Activate ascending sort for column First name"
    )
    expect(screen.getByTestId("sort-button-middleName")).toHaveAccessibleDescription(
      "Activate ascending sort for column Middle name"
    )
    expect(screen.getByTestId("sort-button-lastName")).toHaveAccessibleDescription(
      "Activate descending sort for column Last name"
    )
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(
      { pageIndex: 0, pageSize: 8 },
      [],
      [{ desc: false, id: "lastName" }]
    )

    fireEvent.click(screen.getByTestId("sort-button-firstName"))

    expect(await screen.findByTestId("sort-button-firstName")).toHaveAccessibleDescription(
      "Activate descending sort for column First name"
    )
    expect(screen.getByTestId("sort-button-middleName")).toHaveAccessibleDescription(
      "Activate ascending sort for column Middle name"
    )
    expect(screen.getByTestId("sort-button-lastName")).toHaveAccessibleDescription(
      "Activate ascending sort for column Last name"
    )

    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(mockFetch).toHaveBeenCalledWith(
      { pageIndex: 0, pageSize: 8 },
      [],
      [{ desc: false, id: "firstName" }]
    )

    fireEvent.click(screen.getByTestId("sort-button-firstName"))

    expect(await screen.findByTestId("sort-button-firstName")).toHaveAccessibleDescription(
      "Clear sort for column First name"
    )
    expect(screen.getByTestId("sort-button-middleName")).toHaveAccessibleDescription(
      "Activate ascending sort for column Middle name"
    )
    expect(screen.getByTestId("sort-button-lastName")).toHaveAccessibleDescription(
      "Activate ascending sort for column Last name"
    )

    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(mockFetch).toHaveBeenCalledWith(
      { pageIndex: 0, pageSize: 8 },
      [],
      [{ desc: true, id: "firstName" }]
    )

    fireEvent.click(screen.getByTestId("sort-button-firstName"))

    expect(await screen.findByTestId("sort-button-firstName")).toHaveAccessibleDescription(
      "Activate ascending sort for column First name"
    )
    expect(screen.getByTestId("sort-button-middleName")).toHaveAccessibleDescription(
      "Activate ascending sort for column Middle name"
    )
    expect(screen.getByTestId("sort-button-lastName")).toHaveAccessibleDescription(
      "Activate ascending sort for column Last name"
    )

    expect(mockFetch).toHaveBeenCalledTimes(4)
    expect(mockFetch).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 8 }, [], [])
  })
  it("should hide columns", async () => {
    const mockFetch = jest.fn()

    const defaultItems = [
      { firstName: "TestFirstA", middleName: "TestMiddleA", lastName: "TestLastA" },
      { firstName: "TestFirstB", middleName: "TestMiddleB", lastName: "TestLastB" },
      { firstName: "TestFirstC", middleName: "TestMiddleC", lastName: "TestLastC" },
      { firstName: "TestFirstD", middleName: "TestMiddleD", lastName: "TestLastD" },
      { firstName: "TestFirstE", middleName: "TestMiddleE", lastName: "TestLastE" },
      { firstName: "TestFirstF", middleName: "TestMiddleF", lastName: "TestLastF" },
      { firstName: "TestFirstG", middleName: "TestMiddleG", lastName: "TestLastG" },
      { firstName: "TestFirstH", middleName: "TestMiddleH", lastName: "TestLastH" },
    ]

    mockFetch.mockReturnValue({
      items: defaultItems,
      totalItems: 8,
      currentPage: 1,
      itemsPerPage: 8,
      errorMessage: null,
    })

    const hiddenColumns = [
      columnHelper.accessor("firstName", {
        id: "firstName",
        cell: (props) => props.getValue(),
        header: () => "First name",
        footer: (props) => props.column.id,
        enableSorting: false,
        enableColumnFilter: false,
      }),
      columnHelper.accessor("middleName", {
        id: "middleName",
        cell: (props) => props.getValue(),
        header: () => "Middle name",
        footer: (props) => props.column.id,
        enableSorting: false,
        enableColumnFilter: false,
        meta: { enabled: false },
      }),
      columnHelper.accessor("lastName", {
        id: "lastName",
        cell: (props) => props.getValue(),
        header: () => "Last name",
        footer: (props) => props.column.id,
        enableSorting: false,
        enableColumnFilter: false,
      }),
    ]

    render(
      <QueryClientProvider client={queryClient}>
        <DataTable
          description={"Table caption"}
          columns={hiddenColumns}
          fetchData={mockFetch}
          minSearchCharacters={5}
          initialSort={[{ id: "lastName", desc: false }]}
          filterType={"per-column"}
        />
      </QueryClientProvider>
    )

    expect(await screen.findByRole("columnheader", { name: "First name" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Last name" })).toBeInTheDocument()
    expect(screen.queryByRole("columnheader", { name: "Middle name" })).not.toBeInTheDocument()
    expect(screen.getByText("8 Total listings")).toBeInTheDocument()
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument()
  })
  it("should render empty state", async () => {
    const mockFetch = jest.fn()

    mockFetch.mockReturnValue({
      items: [],
      totalItems: 0,
      errorMessage: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <DataTable columns={defaultColumns} fetchData={mockFetch} description={"Table caption"} />
      </QueryClientProvider>
    )
    expect(await screen.findByRole("columnheader", { name: "First name" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Last name" })).toBeInTheDocument()
    expect(screen.getByText("No data available")).toBeInTheDocument()
    expect(screen.queryByText(/Show/i)).not.toBeInTheDocument()
  })
  it("should render error state", async () => {
    const mockFetch = jest.fn()

    mockFetch.mockReturnValue({
      items: [],
      totalItems: 0,
      errorMessage: "Error fetching data",
    })

    render(
      <QueryClientProvider client={queryClient}>
        <DataTable
          columns={defaultColumns}
          fetchData={mockFetch}
          description={"Table caption"}
          enableHorizontalScroll={true}
          filterType={"per-column"}
        />
      </QueryClientProvider>
    )
    expect(await screen.findByRole("columnheader", { name: "First name" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Last name" })).toBeInTheDocument()
    expect(screen.getByText("Error fetching data")).toBeInTheDocument()
    expect(screen.queryByText(/Show/i)).not.toBeInTheDocument()
  })
  it("should change items per page", async () => {
    const mockFetch = jest.fn()

    const fullItems = [
      { firstName: "TestFirstA", lastName: "TestLastA" },
      { firstName: "TestFirstB", lastName: "TestLastB" },
      { firstName: "TestFirstC", lastName: "TestLastC" },
      { firstName: "TestFirstD", lastName: "TestLastD" },
      { firstName: "TestFirstE", lastName: "TestLastE" },
      { firstName: "TestFirstF", lastName: "TestLastF" },
      { firstName: "TestFirstG", lastName: "TestLastG" },
      { firstName: "TestFirstH", lastName: "TestLastH" },
      { firstName: "TestFirstI", lastName: "TestLastI" },
      { firstName: "TestFirstJ", lastName: "TestLastJ" },
      { firstName: "TestFirstK", lastName: "TestLastK" },
      { firstName: "TestFirstL", lastName: "TestLastL" },
      { firstName: "TestFirstM", lastName: "TestLastM" },
      { firstName: "TestFirstN", lastName: "TestLastN" },
      { firstName: "TestFirstO", lastName: "TestLastO" },
      { firstName: "TestFirstP", lastName: "TestLastP" },
      { firstName: "TestFirstQ", lastName: "TestLastQ" },
      { firstName: "TestFirstR", lastName: "TestLastR" },
      { firstName: "TestFirstS", lastName: "TestLastS" },
      { firstName: "TestFirstT", lastName: "TestLastT" },
      { firstName: "TestFirstU", lastName: "TestLastU" },
      { firstName: "TestFirstV", lastName: "TestLastV" },
      { firstName: "TestFirstW", lastName: "TestLastW" },
      { firstName: "TestFirstX", lastName: "TestLastX" },
      { firstName: "TestFirstY", lastName: "TestLastY" },
      { firstName: "TestFirstZ", lastName: "TestLastZ" },
      { firstName: "TestFirstBA", lastName: "TestLastBA" },
    ]

    mockFetch.mockReturnValue({
      items: fullItems.slice(0, 8),
      totalItems: 25,
      currentPage: 1,
      itemsPerPage: 8,
      errorMessage: null,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <DataTable
          columns={defaultColumns}
          fetchData={mockFetch}
          minSearchCharacters={5}
          description={"Table caption"}
          filterType={"per-column"}
        />
      </QueryClientProvider>
    )

    expect(await screen.findByRole("columnheader", { name: /First name/i })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: /Last name/i })).toBeInTheDocument()
    expect(screen.getByText("25 Total listings")).toBeInTheDocument()
    expect(screen.getByText("Page 1 of 4")).toBeInTheDocument()

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 8 }, [], [])
    const showInput = screen.getByRole("combobox", { name: "Show" })
    mockFetch.mockReturnValueOnce({
      items: fullItems,
      totalItems: 25,
      currentPage: 1,
      itemsPerPage: 25,
      errorMessage: null,
    })
    fireEvent.change(showInput, { target: { value: "25" } })
    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(mockFetch).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 25 }, [], [])
    expect(await screen.findByText("Page 1 of 1")).toBeInTheDocument()
  })
})
