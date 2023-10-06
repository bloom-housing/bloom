import * as React from "react"
import { StandardTable } from "@bloom-housing/ui-components"
import { TableHeaders, StandardTableData } from "@bloom-housing/ui-components"

export interface MinimalTableProps {
  /** If the table should be sortable through dragging */
  draggable?: boolean
  /** A set state function tied to the table's data, used if the table is draggable */
  setData?: (data: unknown[]) => void
  /** The headers for the table passed as text content with optional settings */
  headers: TableHeaders
  /** The table data passed as records of column name to cell data with optional settings */
  data?: StandardTableData
  /** Removes cell margins on the left of every row's first cell */
  flushLeft?: boolean
  /** Removes cell margins on the right of every row's last cell */
  flushRight?: boolean
  /** If the table should collapse on mobile views to show repeating columns on the left for every row */
  responsiveCollapse?: boolean
  /** A class name applied to the root of the table */
  className?: string
  /** A class name applied to the cells of the table */
  cellClassName?: string
  /** An id applied to the table */
  id?: string
}

const MinimalTable = (props: MinimalTableProps) => {
  const tableClasses = ["td-plain", "th-plain", props.className]
  if (props.flushLeft) tableClasses.push("is-flush-left")
  if (props.flushRight) tableClasses.push("is-flush-right")
  return (
    <StandardTable
      className="table-container"
      draggable={props.draggable}
      setData={props.setData}
      headers={props.headers}
      data={props.data}
      tableClassName={tableClasses.join(" ")}
      cellClassName={`${props.cellClassName ? props.cellClassName : `px-5 py-3`}`}
      responsiveCollapse={props.responsiveCollapse}
      id={props.id}
    />
  )
}

export { MinimalTable as default, MinimalTable }
