import * as React from "react"
import { TableHeaders, BasicTable } from "./BasicTable"

interface SimpleTableProps {
  headers: TableHeaders
  data: Record<string, any>[]
}

const SimpleTable = (props: SimpleTableProps) => {
  return (
    <BasicTable
      headers={props.headers}
      data={props.data}
      tableClassName="td-plain th-plain"
      cellClassName="px-5 py-3"
    />
  )
}

export { SimpleTable as default, SimpleTable }
