import * as React from "react"
import { TableHeaders, StandardTable } from "./StandardTable"

export interface MinimalTableProps {
  draggable?: boolean
  setData?: (data: unknown[]) => void
  headers: TableHeaders
  data?: Record<string, React.ReactNode>[]
  flushLeft?: boolean
  flushRight?: boolean
  responsiveCollapse?: boolean
  className?: string
  cellClassName?: string
  id?: string
}

const MinimalTable = (props: MinimalTableProps) => {
  const tableClasses = ["td-plain", "th-plain", props.className]
  if (props.flushLeft) tableClasses.push("is-flush-left")
  if (props.flushRight) tableClasses.push("is-flush-right")
  return (
    <StandardTable
      draggable={props.draggable}
      setData={props.setData}
      headers={props.headers}
      data={props.data}
      tableClassName={tableClasses.join(" ")}
      responsiveCollapse={props.responsiveCollapse}
      id={props.id}
    />
  )
}

export { MinimalTable as default, MinimalTable }
