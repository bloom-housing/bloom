import * as React from "react"
import { nanoid } from "nanoid"

export interface TableHeaders {
  [key: string]: string
}

export const Row = (props: { id?: string; className?: string; children: React.ReactNode }) => (
  <tr id={props.id} className={props.className}>
    {props.children}
  </tr>
)

export const HeaderCell = (props: { children: React.ReactNode }) => <th>{props.children}</th>

export const Cell = (props: {
  headerLabel?: string
  className?: string
  colSpan?: number
  children: React.ReactNode
}) => (
  <td data-label={props.headerLabel} className={props.className || "p-5"} colSpan={props.colSpan}>
    {props.children}
  </td>
)

export interface StandardTableProps {
  headers: TableHeaders
  data: Record<string, React.ReactNode>[]
  tableClassName?: string
  cellClassName?: string
  responsiveCollapse?: boolean
}

export const StandardTable = (props: StandardTableProps) => {
  const { headers, data, cellClassName } = props

  const headerLabels = Object.values(headers).map((col) => {
    const uniqKey = process.env.NODE_ENV === "test" ? "" : nanoid()
    return <HeaderCell key={uniqKey}>{col}</HeaderCell>
  })

  const body = data.map((row: Record<string, React.ReactNode>) => {
    const rowKey = (row["id"] as string) || (process.env.NODE_ENV === "test" ? "" : nanoid())
    const cols = Object.keys(headers).map((colKey) => {
      const uniqKey = process.env.NODE_ENV === "test" ? "" : nanoid()
      const header = headers[colKey]
      const cell = row[colKey]
      return (
        <Cell key={uniqKey} headerLabel={header} className={cellClassName}>
          {cell}
        </Cell>
      )
    })
    return (
      <Row id={"row-" + rowKey} key={rowKey}>
        {cols}
      </Row>
    )
  })

  const tableClasses = ["w-full", "text-sm"]
  if (props.responsiveCollapse) {
    tableClasses.push("responsive-collapse")
  }
  if (props.tableClassName) {
    tableClasses.push(props.tableClassName)
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className={tableClasses.join(" ")}>
        <thead>
          <Row>{headerLabels}</Row>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  )
}
