import * as React from "react"
import { nanoid } from "nanoid"

export const Row = (props: any) => (
  <tr id={props.id} className={props.className}>
    {props.children}
  </tr>
)

export const HeaderCell = (props: any) => <th>{props.children}</th>

export const Cell = (props: any) => (
  <td data-label={props.headerLabel} className={props.className || "p-5"} colSpan={props.colSpan}>
    {props.children}
  </td>
)

export interface Headers {
  [key: string]: string
}

export interface BasicTableProps {
  headers: Headers
  data: Array<Record<string, any>>
  cellClassName?: string
  responsiveCollapse?: boolean
}

export const BasicTable = (props: BasicTableProps) => {
  const { headers, data, cellClassName } = props

  const headerLabels = Object.values(headers).map((col) => {
    const uniqKey = process.env.NODE_ENV === "test" ? "" : nanoid()
    return <HeaderCell key={uniqKey}>{col}</HeaderCell>
  })

  const body = data.map((row: any) => {
    const rowKey = row["id"] || (process.env.NODE_ENV === "test" ? "" : nanoid())
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
