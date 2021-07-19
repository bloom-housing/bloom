import * as React from "react"
import { TableHeaders, StandardTable } from "./StandardTable"

interface MinimalTableProps {
  draggable?: boolean
  headers: TableHeaders
  data: Record<string, React.ReactNode>[]
  flushLeft?: boolean
  flushRight?: boolean
}

const MinimalTable = (props: MinimalTableProps) => {
  const tableClasses = ["td-plain", "th-plain"]
  if (props.flushLeft) tableClasses.push("is-flush-left")
  if (props.flushRight) tableClasses.push("is-flush-right")

  return (
    <StandardTable
      draggable={props.draggable}
      headers={props.headers}
      data={props.data}
      tableClassName={tableClasses.join(" ")}
      cellClassName="px-5 py-3"
    />
  )
}

export { MinimalTable as default, MinimalTable }
