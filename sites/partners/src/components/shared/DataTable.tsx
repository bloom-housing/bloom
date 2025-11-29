import React, { useEffect, useState } from "react"

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
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

import styles from "./DataTable.module.scss"
import { Button, Icon, LoadingState } from "@bloom-housing/ui-seeds"
import { PaginationMeta } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { data } from "autoprefixer"

export type TableDataRow = { [key: string]: string | React.ReactNode }

export type MetaType = {
  enabled?: boolean
}

export interface TableData {
  errorMessage?: string
  items: TableDataRow[]
  loading?: boolean
  meta?: PaginationMeta
  search?: boolean
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
  fetchData: (
    pagination?: PaginationState,
    search?: ColumnFiltersState,
    sort?: SortingState
  ) => Promise<TableData>
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
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
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
    rowCount: dataQuery.data?.meta?.totalItems,
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      sorting,
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
                  <button
                    {...{
                      className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: (
                        <Icon className={styles["sort-icon"]}>
                          <ArrowUpIcon />
                        </Icon>
                      ),
                      desc: (
                        <Icon className={styles["sort-icon"]}>
                          <ArrowDownIcon />
                        </Icon>
                      ),
                      false: (
                        <Icon className={styles["sort-icon"]}>
                          <ArrowsUpDownIcon />
                        </Icon>
                      ),
                    }[header.column.getIsSorted() as string] ?? null}
                  </button>
                ) : (
                  flexRender(header.column.columnDef.header, header.getContext())
                )}
                {header.column.getCanFilter() ? (
                  <div>
                    <Filter column={header.column} />
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
              <td colSpan={table.getVisibleFlatColumns().length} className="text-center p-4">
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
              <td colSpan={props.columns.length} className="text-center p-4">
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
              {dataQuery.data?.meta?.totalItems} Total{" "}
              {dataQuery.data?.meta?.totalItems === 1 ? "listing" : "listings"}
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

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue()

  return (
    <DebouncedInput
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
  )
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  minCharacters = 3,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
  minCharacters?: number
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
      <input
        {...props}
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

// function Filter({ column, table }: { column: Column<any, any>; table: Table<any> }) {
//   const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id)

//   const columnFilterValue = column.getFilterValue()

//   return typeof firstValue === "number" ? (
//     <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
//       <input
//         type="number"
//         value={(columnFilterValue as [number, number])?.[0] ?? ""}
//         onChange={(e) =>
//           column.setFilterValue((old: [number, number]) => [e.target.value, old?.[1]])
//         }
//         placeholder={`Min`}
//         className="w-24 border shadow rounded"
//       />
//       <input
//         type="number"
//         value={(columnFilterValue as [number, number])?.[1] ?? ""}
//         onChange={(e) =>
//           column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])
//         }
//         placeholder={`Max`}
//         className="w-24 border shadow rounded"
//       />
//     </div>
//   ) : (
//     <input
//       className="w-36 border shadow rounded"
//       onChange={(e) => column.setFilterValue(e.target.value)}
//       onClick={(e) => e.stopPropagation()}
//       placeholder={`Search...`}
//       type="text"
//       value={(columnFilterValue ?? "") as string}
//     />
//   )
// }
