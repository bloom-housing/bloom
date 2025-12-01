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

// Returns appropriate aria-label for sortable headers based on current sort state
const getHeaderAriaLabel = (header: Header<TableDataRow, unknown>) => {
  if (!header.column.getIsSorted()) {
    return t("table.activateAscending")
  } else if (header.column.getIsSorted() === "asc") {
    return t("table.activateDescending")
  } else if (header.column.getIsSorted() === "desc") {
    return t("table.clearSort")
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
      }, 300)

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
                      header={header}
                      minSearchCharacters={props.minSearchCharacters || 3}
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

  const getTableContent = () => {
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

  return (
    <div className={styles["data-table-wrapper"]}>
      <div className={styles["data-table-container"]}>
        <table
          className={`${styles["data-table"]} ${
            props.enableHorizontalScroll ? styles["enable-scroll"] : ""
          }`}
        >
          {getTableContent()}
        </table>
      </div>
      <div className={styles["pagination"]}>
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

            <span className={styles["show-items-per-page"]}>
              <label htmlFor="show-numbers" className={styles["show-label"]}>
                {t("t.show")}
              </label>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value))
                }}
                className={styles["show-select"]}
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
      </div>
    </div>
  )
}

interface DataTableFilterProps {
  header: Header<TableDataRow, unknown>
  minSearchCharacters: number
}

const DataTableFilter = (props: DataTableFilterProps) => {
  const columnFilterValue = props.header.column.getFilterValue()
  const [value, setValue] = React.useState((columnFilterValue ?? "") as string)

  // Reset filter if input length becomes less than minSearchCharacters
  // Does not make more than one call due to request caching in useQuery
  useEffect(() => {
    if (value.length > 0 && value.length < props.minSearchCharacters) {
      props.header.column.setFilterValue("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <DataTableDebouncedInput
      inputName={
        (props.header.column.columnDef.meta as MetaType)?.filterLabelName ||
        props.header.column.columnDef.id
      }
      minCharacters={props.minSearchCharacters}
      onChange={(value) => props.header.column.setFilterValue(value)}
      inputProps={{
        placeholder: t("t.search"),
        type: "text",
      }}
      setValue={setValue}
      value={value}
    />
  )
}

interface DataTableDebouncedInputProps {
  debounce?: number
  inputName: string
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
  minCharacters?: number
  onChange: (value: string | number) => void
  setValue: React.Dispatch<React.SetStateAction<string>>
  value: string
}

export const DataTableDebouncedInput = (props: DataTableDebouncedInputProps) => {
  const debounce = props.debounce || 500

  useEffect(() => {
    props.setValue(props.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value])

  useEffect(() => {
    if (
      props.minCharacters &&
      props.value.toString().length > 0 &&
      props.value.toString().length < props.minCharacters
    ) {
      return
    }
    const timeout = setTimeout(() => {
      props.onChange(props.value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value])

  return (
    <>
      <label htmlFor={props.inputName} className="sr-only">
        {t("listings.table.searchBy", { column: props.inputName })}
      </label>
      <input
        className={styles["search-input"]}
        id={props.inputName}
        onChange={(e) => props.setValue(e.target.value)}
        value={props.value}
        {...props.inputProps}
      />
      {props.minCharacters && (
        <div className={styles["min-characters-info"]}>
          {t("table.searchSubtext", { char: props.minCharacters })}
        </div>
      )}
    </>
  )
}
