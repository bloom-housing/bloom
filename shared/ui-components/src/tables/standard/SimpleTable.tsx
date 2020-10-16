import * as React from "react"
import { BasicTable } from "./BasicTable"

const SimpleTable = (props: any) => {
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
