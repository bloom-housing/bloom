import * as React from "react"
import nanoid from "nanoid"
export const Row = (props: any) => <tr id={props.id}>{props.children}</tr>

export const HeaderCell = (props: any) => (
  <th className="text-left uppercase bg-gray-200 p-5 font-semibold tracking-wider border-0 border-b border-blue-600">
    {props.children}
  </th>
)

export const Cell = (props: any) => (
  <td data-label={props.headerLabel} className={props.cellPadding || "p-5"}>
    {props.children}
  </td>
)

export interface Headers {
  [key: string]: string
}

export interface BasicTableProps {
  headers: Headers
  data: any
  cellPadding?: string
  responsiveCollapse?: boolean
}

export const BasicTable = (props: BasicTableProps) => {
  const { headers, data, cellPadding } = props

  const headerLabels = Object.values(headers).map(col => {
    const uniqKey = nanoid()
    return <HeaderCell key={uniqKey}>{col}</HeaderCell>
  })

  const body = data.map((row: any) => {
    const rowKey = row["id"] || nanoid()
    const cols = Object.keys(headers).map(colKey => {
      const uniqKey = nanoid()
      const header = headers[colKey]
      const cell = row[colKey]
      return (
        <Cell key={uniqKey} headerLabel={header} cellPadding={cellPadding}>
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
