import React, { useEffect, useState } from "react"

import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import styles from "./DataTable.module.scss"
import { Button, LoadingState } from "@bloom-housing/ui-seeds"
import { PaginationMeta } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export type TableDataRow = { [key: string]: string | React.ReactNode }

export interface TableData {
  items: TableDataRow[]
  error?: any
  loading?: boolean
  meta?: PaginationMeta
}

interface DataTableProps {
  columns: ColumnDef<TableDataRow>[]
  data: TableData
  fetchData: (pagination: PaginationState) => Promise<TableData>
}

export const DataTable = (props: DataTableProps) => {
  const rerender = React.useReducer(() => ({}), {})[1]

  return (
    <>
      <MyTable
        {...{
          data: props.data,
          columns: props.columns,
          fetchData: props.fetchData,
        }}
      />
      {/* <hr /> */}
      {/* <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div> */}
    </>
  )
}

const MyTable = (props: DataTableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: props.data.meta?.itemCount || 8,
  })

  const [delayedLoading, setDelayedLoading] = useState(false)

  const dataQuery = useQuery({
    queryKey: ["data", pagination],
    queryFn: () => props.fetchData(pagination),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  })

  const defaultData = React.useMemo(() => [], [])

  useEffect(() => {
    if (dataQuery.isLoading || (dataQuery.isFetching && !dataQuery.isFetched)) {
      const timer = setTimeout(() => {
        setDelayedLoading(true)
      }, 300) // 300ms delay

      return () => clearTimeout(timer)
    } else {
      setDelayedLoading(false)
    }
  }, [dataQuery.isLoading, dataQuery.isFetching, dataQuery.isFetched])

  const table = useReactTable({
    columns: props.columns,
    data: dataQuery.data?.items ?? defaultData,
    rowCount: dataQuery.data?.meta?.totalItems,
    // debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
    },
    // defaultColumn: {
    //   size: 200, //starting column size
    //   minSize: 50, //enforced during column resizing
    //   maxSize: 500, //enforced during column resizing
    // },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  })

  const ROW_HEIGHT = 56.5
  const HEADER_HEIGHT = 64.5

  const tableHeaders = (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <th key={header.id} colSpan={header.colSpan}>
                <button
                  {...{
                    className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                    onClick: header.column.getToggleSortingHandler(),
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </button>
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
            colSpan={props.columns.length}
            style={{
              height: `${ROW_HEIGHT * (dataQuery.data?.meta?.itemCount || 8) + HEADER_HEIGHT}px`,
            }}
          >
            <LoadingState loading={delayedLoading} className={styles["loading-spinner"]}>
              <div className={styles["loading-content"]} style={{ height: "150px" }}></div>
            </LoadingState>
          </td>
        </tr>
      )
    } else if (dataQuery.data?.items.length === 0) {
      return (
        <>
          {tableHeaders}
          <tbody>
            <tr>
              <td colSpan={props.columns.length} className="text-center p-4">
                No data available.
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
                      <td key={cell.id}>
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
    <div>
      <table className={styles["data-table"]}>{getBodyContent()}</table>
      <div>
        <div className={styles["pagination"]}>
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            variant={"primary-outlined"}
          >
            Previous
          </Button>

          <div className={styles["pagination-info-right"]}>
            <span className={styles["page-info"]}>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount().toLocaleString()}
            </span>
            <span className={styles["show-numbers-container"]}>
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
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      {/* <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre> */}
    </div>
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
