import * as React from "react"
import { nanoid } from "nanoid"
import { Cell, StandardTableData, StandardTableProps } from "./StandardTable"

export interface GroupedTableGroup {
  header?: string | React.ReactNode
  className?: string
  data: StandardTableData
}

export interface GroupedTableProps extends Omit<StandardTableProps, "data"> {
  data: GroupedTableGroup[]
}

export const GroupedTable = (props: GroupedTableProps) => {
  const { headers, data, cellClassName } = props

  const headerLabels = Object.values(headers).map((col, index) => {
    const uniqKey = process.env.NODE_ENV === "test" ? `header-${index}` : nanoid()
    return <th key={uniqKey}>{col}</th>
  })

  const body: React.ReactNode[] = []

  data.forEach((group: GroupedTableGroup, dataIndex) => {
    const colSpan = Object.keys(headers).length

    const groupHeader = group.header
    const groupClassName = group.className
    const groupData = group.data

    if (groupHeader) {
      body.push(
        <tr key={process.env.NODE_ENV === "test" ? "data-header" : nanoid()}>
          <Cell
            key={process.env.NODE_ENV === "test" ? "cell-header" : nanoid()}
            className={groupClassName}
            colSpan={colSpan}
          >
            {groupHeader}
          </Cell>
        </tr>
      )
    }

    groupData.forEach((row, groupDataIndex) => {
      const rowKey = row["id"]
        ? `row-${row["id"].content as string}`
        : process.env.NODE_ENV === "test"
        ? `groupedrow-${dataIndex}-${groupDataIndex}`
        : nanoid()
      const cols = Object.keys(headers).map((colKey, colIndex) => {
        const uniqKey = process.env.NODE_ENV === "test" ? `col-${colIndex}` : nanoid()
        const header = headers[colKey]
        const cell = row[colKey]?.content
        return (
          <Cell key={uniqKey} headerLabel={header} className={cellClassName}>
            {cell}
          </Cell>
        )
      })

      body.push(
        <tr id={rowKey} key={rowKey} className={`group-${groupClassName}`}>
          {cols}
        </tr>
      )
    })
  })

  const tableClasses = ["w-full", "text-sm"]
  if (props.responsiveCollapse) {
    tableClasses.push("responsive-collapse")
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className={tableClasses.join(" ")}>
        <thead>
          <tr>{headerLabels}</tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  )
}
