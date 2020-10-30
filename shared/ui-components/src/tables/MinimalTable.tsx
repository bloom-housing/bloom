import * as React from "react"
import { TableHeaders, StandardTable } from "./StandardTable"

interface MinimalTableProps {
  headers: TableHeaders
  data: Record<string, React.ReactNode>[]
}

const MinimalTable = (props: MinimalTableProps) => {
  return (
    <StandardTable
      headers={props.headers}
      data={props.data}
      tableClassName="td-plain th-plain"
      cellClassName="px-5 py-3"
    />
  )
}

export { MinimalTable as default, MinimalTable }
