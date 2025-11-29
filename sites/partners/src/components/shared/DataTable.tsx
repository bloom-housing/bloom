import React, { useEffect, useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  Header,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import ArrowsUpDownIcon from "@heroicons/react/16/solid/ArrowsUpDownIcon"
import ArrowUpIcon from "@heroicons/react/16/solid/ArrowUpIcon"
import ArrowDownIcon from "@heroicons/react/16/solid/ArrowDownIcon"
import { Button, Icon, LoadingState } from "@bloom-housing/ui-seeds"
import styles from "./DataTable.module.scss"

export type TableDataRow = { [key: string]: string | React.ReactNode }

export type MetaType = {
  enabled?: boolean
  filterLabelName?: string
}

export interface TableData {
  errorMessage?: string
  items: TableDataRow[]
  totalItems?: number
}

export interface FetchDataParams {
  pagination?: PaginationState
  search?: string
}

interface DataTableProps {
  columns: ColumnDef<TableDataRow>[]
  defaultItemsPerPage?: number
  enableHorizontalScroll?: boolean
  initialSort?: SortingState
  minSearchCharacters?: number
  fetchData: (
    pagination?: PaginationState,
    search?: ColumnFiltersState,
    sort?: SortingState
  ) => Promise<TableData>
}

const getHeaderAriaLabel = (header: Header<any, unknown>) => {
  if (!header.column.getIsSorted()) {
    return "Activate ascending sort"
  } else if (header.column.getIsSorted() === "asc") {
    return "Activate descending sort"
  } else if (header.column.getIsSorted() === "desc") {
    return "Deactivate sorting"
  }
}

export const DataTable = (props: DataTableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: props.defaultItemsPerPage || 8,
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>(props.initialSort ?? [])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [delayedLoading, setDelayedLoading] = useState(false)

  const dataQuery = useQuery({
    queryKey: ["data", pagination, columnFilters, sorting],
    queryFn: () => props.fetchData(pagination, columnFilters, sorting),
    placeholderData: keepPreviousData, // prevent row flash between quick fetches
  })

  const defaultData = React.useMemo(() => [], [])

  useEffect(() => {
    if (dataQuery.isLoading || (dataQuery.isFetching && !dataQuery.isFetched)) {
      const timer = setTimeout(() => {
        setDelayedLoading(true)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setDelayedLoading(false)
    }
  }, [dataQuery.isLoading, dataQuery.isFetching, dataQuery.isFetched])

  useEffect(() => {
    table.getHeaderGroups().map((headerGroup) => {
      headerGroup.headers.map((header) => {
        if ((header.column.columnDef.meta as MetaType)?.enabled === false) {
          header.column.toggleVisibility(false)
        }
      })
    })
  }, [])

  const table = useReactTable({
    columns: props.columns,
    data: dataQuery.data?.items ?? defaultData,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: dataQuery.data?.totalItems,
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      sorting,
    },
    defaultColumn: {
      size: props.enableHorizontalScroll ? 100 : 150,
      minSize: 100,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  })

  const tableHeaders = (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <th
                key={header.id}
                colSpan={header.colSpan}
                style={{
                  width: header.getSize(),
                }}
              >
                {header.column.getCanSort() ? (
                  <>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <button
                      {...{
                        className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                      aria-label={getHeaderAriaLabel(header)}
                    >
                      {{
                        asc: (
                          <Icon className={styles["sort-icon"]} aria-label={"Sort ascending"}>
                            <ArrowUpIcon />
                          </Icon>
                        ),
                        desc: (
                          <Icon className={styles["sort-icon"]} aria-label={"Sort descending"}>
                            <ArrowDownIcon />
                          </Icon>
                        ),
                        false: (
                          <Icon className={styles["sort-icon"]} aria-label={"Sort not applied"}>
                            <ArrowsUpDownIcon />
                          </Icon>
                        ),
                      }[header.column.getIsSorted() as string] ?? null}
                    </button>
                  </>
                ) : (
                  flexRender(header.column.columnDef.header, header.getContext())
                )}
                {header.column.getCanFilter() ? (
                  <div>
                    <Filter header={header} minSearchCharacters={props.minSearchCharacters || 3} />
                  </div>
                ) : null}
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )

  const getBodyContent = () => {
    if (delayedLoading) {
      return (
        <tr className={styles["loading-row"]}>
          <td
            colSpan={table.getVisibleFlatColumns().length}
            style={{
              height: `${document.getElementById("data-table")?.offsetHeight}px`,
            }}
          >
            <LoadingState loading={delayedLoading} className={styles["loading-spinner"]}>
              <div className={styles["loading-content"]} />
            </LoadingState>
          </td>
        </tr>
      )
    } else if (dataQuery.data?.errorMessage) {
      return (
        <>
          {tableHeaders}
          <tbody>
            <tr>
              <td
                colSpan={table.getVisibleFlatColumns().length}
                className={`${styles["full-width-text-cell"]} ${styles["error-cell"]}`}
              >
                <div>{dataQuery.data.errorMessage}</div>
              </td>
            </tr>
          </tbody>
        </>
      )
    } else if (dataQuery.data?.items?.length === 0) {
      return (
        <>
          {tableHeaders}
          <tbody>
            <tr>
              <td
                colSpan={table.getVisibleFlatColumns().length}
                className={styles["full-width-text-cell"]}
              >
                No data available
              </td>
            </tr>
          </tbody>
        </>
      )
    } else {
      return (
        <>
          {tableHeaders}
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </>
      )
    }
  }

  return (
    <>
      <div className={styles["data-table-container"]}>
        <table
          className={`${styles["data-table"]} ${
            props.enableHorizontalScroll ? styles["enable-scroll"] : ""
          }`}
          id={"data-table"}
        >
          {getBodyContent()}
        </table>
      </div>
      <div>
        <div className={styles["pagination"]}>
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            variant={"primary-outlined"}
            id="previous-page-button"
            className={styles["previous-page-button"]}
          >
            Previous
          </Button>

          {dataQuery.data?.items?.length > 0 && !dataQuery.data?.errorMessage && (
            <span className={styles["total-items"]}>
              {dataQuery.data?.totalItems} Total{" "}
              {dataQuery.data?.totalItems === 1 ? "listing" : "listings"}
            </span>
          )}
          <span className={styles["show-items-per-page"]}>
            <label htmlFor="show-numbers" className={styles["show-label"]}>
              Show
            </label>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              id={"show-numbers"}
              className={styles["show-select"]}
            >
              {[3, 8, 25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </span>

          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant={"primary-outlined"}
            className={styles["next-page-button"]}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  )
}

function Filter({
  header,
  minSearchCharacters,
}: {
  header: Header<any, unknown>
  minSearchCharacters: number
}) {
  const columnFilterValue = header.column.getFilterValue()

  return (
    <DebouncedInput
      onChange={(value) => header.column.setFilterValue(value)}
      placeholder={`Search`}
      minCharacters={minSearchCharacters}
      type="text"
      value={(columnFilterValue ?? "") as string}
      inputName={
        (header.column.columnDef.meta as MetaType)?.filterLabelName || header.column.columnDef.id
      }
    />
  )
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  minCharacters,
  inputName,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
  minCharacters?: number
  inputName: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (minCharacters && value.toString().length > 0 && value.toString().length < minCharacters) {
      return
    }
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <>
      <label htmlFor={inputName} className="sr-only">
        {`Search listings by ${inputName}`}
      </label>
      <input
        {...props}
        id={inputName}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={styles["search-input"]}
      />
      {minCharacters && (
        <div
          className={styles["min-characters-info"]}
        >{`Enter at least ${minCharacters} characters`}</div>
      )}
    </>
  )
}
