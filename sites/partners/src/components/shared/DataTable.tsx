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
import { t } from "@bloom-housing/ui-components"
import styles from "./DataTable.module.scss"

// We need to disable this rule to allow us to use aria-description to prevent filter and sort information in headers from being re-read for every cell
/* eslint-disable jsx-a11y/role-supports-aria-props */

export type TableDataRow = { [key: string]: string | React.ReactNode }

export type MetaType = {
  // Whether the column is shown or hidden
  enabled?: boolean
  // If using filtering or sorting on a column, this field will support generating accessible labels
  plaintextName?: string
}

export interface TableData {
  // If present, displays an error message instead of table rows
  errorMessage?: string
  // The actual data rows to display in the table
  items: TableDataRow[]
  // Total number of items available (for pagination)
  totalItems?: number
  // Current page number (for pagination)
  currentPage?: number
  // Number of items per page (for pagination)
  itemsPerPage?: number
}

interface DataTableProps {
  // A description of the table for screen readers
  description: string
  // The columns to display in the table
  columns: ColumnDef<TableDataRow>[]
  // The default number of items to show per page
  defaultItemsPerPage?: number
  // Whether to enable horizontal scrolling for wide tables, or autofit columns within the container
  enableHorizontalScroll?: boolean
  // Function to fetch data for the table based on pagination, search, and sort parameters
  fetchData: (
    pagination?: PaginationState,
    search?: ColumnFiltersState,
    sort?: SortingState
  ) => Promise<TableData>
  // Initial sort state for the table
  initialSort?: SortingState
  // Minimum number of characters required to trigger filtering
  minSearchCharacters?: number
}

// Returns appropriate aria-label for sortable headers based on current sort state
const getHeaderAriaLabel = (header: Header<TableDataRow, unknown>) => {
  const columnName =
    (header.column.columnDef.meta as MetaType)?.plaintextName || header.column.columnDef.id
  if (!header.column.getIsSorted()) {
    return t("table.activateAscending", {
      colName: columnName,
    })
  } else if (header.column.getIsSorted() === "asc") {
    return t("table.activateDescending", {
      colName: columnName,
    })
  } else if (header.column.getIsSorted() === "desc") {
    return t("table.clearSort", {
      colName: columnName,
    })
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
    placeholderData: keepPreviousData,
  })

  // Slightly delay loading state to prevent flickering on fast fetches
  useEffect(() => {
    if (dataQuery.isLoading || (dataQuery.isFetching && !dataQuery.isFetched)) {
      const timer = setTimeout(() => {
        setDelayedLoading(true)
      }, 350)

      return () => clearTimeout(timer)
    } else {
      setDelayedLoading(false)
    }
  }, [dataQuery.isLoading, dataQuery.isFetching, dataQuery.isFetched])

  // On initial load, hide any columns that have been disabled via meta.enabled = false
  useEffect(() => {
    table.getHeaderGroups().map((headerGroup) => {
      headerGroup.headers.map((header) => {
        if ((header.column.columnDef.meta as MetaType)?.enabled === false) {
          header.column.toggleVisibility(false)
        }
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const defaultData = React.useMemo(() => [], [])

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
    onColumnFiltersChange: (props) => {
      setColumnFilters(props)
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (props) => {
      setPagination(props)
      document.getElementById("data-table")?.scrollIntoView({ behavior: "auto", block: "start" })
    },
    onSortingChange: (sorting) => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
      setSorting(sorting)
    },
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

  const showLoadingState = delayedLoading || dataQuery.data === undefined

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
                scope={"col"}
                aria-sort={
                  header.column.getIsSorted() === "asc"
                    ? "ascending"
                    : header.column.getIsSorted() === "desc"
                    ? "descending"
                    : "none"
                }
              >
                {header.column.getCanSort() ? (
                  <>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <button
                      {...{
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                      aria-description={getHeaderAriaLabel(header)}
                      data-testid={`sort-button-${header.id}`}
                    >
                      {{
                        asc: (
                          <Icon
                            className={styles["sort-icon"]}
                            aria-label={t("table.sortAscending")}
                          >
                            <ArrowUpIcon />
                          </Icon>
                        ),
                        desc: (
                          <Icon
                            className={styles["sort-icon"]}
                            aria-label={t("table.sortDescending")}
                          >
                            <ArrowDownIcon />
                          </Icon>
                        ),
                        false: (
                          <Icon
                            className={styles["sort-icon"]}
                            aria-label={t("table.sortNotApplied")}
                          >
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
                    <DataTableFilter
                      columnFilterValue={(header.column.getFilterValue() as string) || ""}
                      header={header}
                      minSearchCharacters={props.minSearchCharacters || 3}
                      setPagination={setPagination}
                    />
                  </div>
                ) : null}
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )

  const APPROX_ROW_HEIGHT = 55

  const getTableContent = () => {
    if (delayedLoading || dataQuery.data === undefined) {
      return (
        <tbody>
          <tr className={styles["loading-row"]}>
            <td
              colSpan={table.getVisibleFlatColumns().length}
              style={{
                height: `${
                  dataQuery.data === undefined
                    ? APPROX_ROW_HEIGHT * ((props.defaultItemsPerPage || 8) + 1)
                    : document.getElementById("data-table")?.offsetHeight
                }px`,
              }}
            >
              <LoadingState loading={true} className={styles["loading-spinner"]}>
                <div className={styles["loading-content"]} />
              </LoadingState>
            </td>
          </tr>
        </tbody>
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
                {dataQuery.data.errorMessage}
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
                {t("table.noData")}
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

  const Pagination = (
    <div
      className={styles["pagination"]}
      id={"data-table-pagination"}
      aria-hidden={showLoadingState}
    >
      <Button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        variant={"primary-outlined"}
        className={styles["previous-page-button"]}
      >
        {t("t.previous")}
      </Button>
      {dataQuery.data?.items?.length > 0 && !dataQuery.data?.errorMessage && (
        <>
          <span className={styles["total-items"]}>
            {dataQuery.data?.totalItems}{" "}
            {dataQuery.data?.totalItems === 1
              ? t("listings.totalListing")
              : t("listings.totalListings")}
          </span>

          <span className={styles["current-page"]}>
            Page {dataQuery.data?.currentPage} of{" "}
            {dataQuery.data?.totalItems &&
              Math.ceil((dataQuery.data?.totalItems || 0) / dataQuery.data?.itemsPerPage)}
          </span>

          <span className={styles["show-items-per-page"]}>
            <label htmlFor="show-numbers" className={styles["show-label"]}>
              {t("t.show")}
            </label>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                table.setPageSize(Number(e.target.value))
              }}
              className={styles["show-select"]}
              id={"show-numbers"}
            >
              {/* TODO: Remove 3 before merge, just for easier pagination testing purposes */}
              {[3, 8, 25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </span>
        </>
      )}

      <Button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        variant={"primary-outlined"}
        className={styles["next-page-button"]}
      >
        {t("t.next")}
      </Button>
      {showLoadingState && <div className={styles["pagination-loading-overlay"]} />}
    </div>
  )

  return (
    <div className={styles["data-table-wrapper"]}>
      <div className={styles["data-table-container"]}>
        <table
          className={`${styles["data-table"]} ${
            props.enableHorizontalScroll ? styles["enable-scroll"] : ""
          } ${showLoadingState ? styles["table-loading"] : ""}`}
          id="data-table"
          aria-label={props.description}
          aria-live={"polite"}
        >
          {getTableContent()}
        </table>
      </div>
      {Pagination}
    </div>
  )
}

interface DataTableFilterProps {
  columnFilterValue: string
  header: Header<TableDataRow, unknown>
  minSearchCharacters: number
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
}

const DataTableFilter = (props: DataTableFilterProps) => {
  const [value, setValue] = React.useState(props.columnFilterValue)
  const debounce = 500

  useEffect(() => {
    // Only set filter value if it has changed
    if (
      value === props.header.column.getFilterValue() ||
      (value === "" && props.header.column.getFilterValue() === undefined)
    ) {
      return
    }

    // Set filter value after debounce period
    const timeout = setTimeout(() => {
      props.setPagination((prev) => ({ ...prev, pageIndex: 0 }))
      // Reset filter if input length becomes less than minSearchCharacters
      // Does not make more than one call due to request caching in useQuery
      if (value.length > 0 && value.length < props.minSearchCharacters) {
        props.header.column.setFilterValue("")
      } else {
        props.header.column.setFilterValue(value)
      }
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const inputName =
    (props.header.column.columnDef.meta as MetaType)?.plaintextName ||
    props.header.column.columnDef.id

  const inputId = `column-search-${inputName}`

  return (
    <>
      <input
        className={styles["search-input"]}
        id={inputId}
        data-testid={inputId}
        onChange={(e) => {
          setValue(e.target.value)
        }}
        placeholder={t("t.search")}
        type={"text"}
        value={value}
        aria-description={`${t("listings.table.searchBy", { column: inputName })} - ${t(
          "table.searchSubtext",
          { char: props.minSearchCharacters }
        )}`}
      />
      {props.minSearchCharacters && (
        <div className={styles["min-characters-info"]} id={"input-helper"} aria-hidden="true">
          {t("table.searchSubtext", { char: props.minSearchCharacters })}
        </div>
      )}
    </>
  )
}
