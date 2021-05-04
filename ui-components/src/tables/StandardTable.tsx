import * as React from "react"
import { nanoid } from "nanoid"
import { t } from "../.."

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

  // Translation strings are optionally passed in with arguments with format `key,argumentName:argumentValue`
  const getTranslatedHeader = (headerKey: string) => {
    if (headerKey.indexOf(",") >= 0) {
      const translation = headerKey.split(",")
      const argument = translation[1].split(":")
      return t(translation[0], { [argument[0]]: argument[1] })
    } else return t(headerKey)
  }

  const headerLabels = Object.values(headers).map((header, index) => {
    const uniqKey = process.env.NODE_ENV === "test" ? `header-${index}` : nanoid()
    return <HeaderCell key={uniqKey}>{getTranslatedHeader(header)}</HeaderCell>
  })

  const body = data.map((row: Record<string, React.ReactNode>, dataIndex) => {
    const rowKey = row["id"]
      ? `row-${row["id"] as string}`
      : process.env.NODE_ENV === "test"
      ? `standardrow-${dataIndex}`
      : nanoid()
    const cols = Object.keys(headers).map((colKey, colIndex) => {
      const uniqKey = process.env.NODE_ENV === "test" ? `standardcol-${colIndex}` : nanoid()
      const cell = row[colKey]
      return (
        <Cell
          key={uniqKey}
          headerLabel={getTranslatedHeader(headers[colKey])}
          className={cellClassName}
        >
          {cell}
        </Cell>
      )
    })
    return (
      <Row id={rowKey} key={rowKey}>
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
