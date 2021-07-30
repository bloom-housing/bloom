import * as React from "react"
import { TableHeaders, StandardTable } from "./StandardTable"

interface ResponsiveTableProps {
  headers: TableHeaders
  data: Record<string, React.ReactNode>[]
  className?: string
}

const ResponsiveTable = (props: ResponsiveTableProps) => {
  const tableClasses = ["base", props.className]

  return (
    <StandardTable
      headers={props.headers}
      data={props.data}
      tableClassName={tableClasses.join(" ")}
      cellClassName="px-5 py-3"
      responsiveCollapse
    />
  )
}

export { ResponsiveTable as default, ResponsiveTable }
