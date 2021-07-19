import React, { useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import { nanoid } from "nanoid"
import { getTranslationWithArguments } from "../helpers/getTranslationWithArguments"

export interface TableHeaders {
  [key: string]: string
}

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

export const TableThumbnail = (props: { children: React.ReactNode }) => {
  return <span className="table__thumbnail">{props.children}</span>
}

export interface StandardTableProps {
  draggable?: boolean
  headers: TableHeaders
  data: Record<string, React.ReactNode>[]
  tableClassName?: string
  cellClassName?: string
  responsiveCollapse?: boolean
}

export const StandardTable = (props: StandardTableProps) => {
  const { headers = {}, data = [], cellClassName } = props

  const [tableData, setTableData] = useState(props.data)

  const headerLabels = Object.values(headers).map((header, index) => {
    const uniqKey = process.env.NODE_ENV === "test" ? `header-${index}` : nanoid()
    return <HeaderCell key={uniqKey}>{getTranslationWithArguments(header)}</HeaderCell>
  })

  const body = tableData.map((row: Record<string, React.ReactNode>, dataIndex) => {
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
          headerLabel={getTranslationWithArguments(headers[colKey])}
          className={cellClassName}
        >
          {cell}
        </Cell>
      )
    })
    return (
      <Draggable draggableId={rowKey} index={dataIndex}>
        {(provided) => (
          <tr
            id={rowKey}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {cols}
          </tr>
        )}
      </Draggable>
    )
  })

  const tableClasses = ["w-full", "text-sm"]
  if (props.responsiveCollapse) {
    tableClasses.push("responsive-collapse")
  }
  if (props.tableClassName) {
    tableClasses.push(props.tableClassName)
  }

  const reorder = (
    list: Record<string, React.ReactNode>[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    if (result.destination.index === result.source.index) {
      return
    }
    const reorderedTableData = reorder(tableData, result.source.index, result.destination.index)
    setTableData(reorderedTableData)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="standard-table">
        {(provided) => (
          <div style={{ overflowX: "auto" }} {...provided.droppableProps} ref={provided.innerRef}>
            <table className={tableClasses.join(" ")}>
              <thead>
                <tr>{headerLabels}</tr>
              </thead>
              <tbody>{body}</tbody>
            </table>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
