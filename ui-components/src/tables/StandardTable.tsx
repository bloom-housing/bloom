import React, { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import { nanoid } from "nanoid"
import { getTranslationWithArguments } from "../helpers/getTranslationWithArguments"
import { Icon } from "../icons/Icon"
import { t } from "../helpers/translator"

export interface TableHeadersOptions {
  name: string
  className: string
}
export interface TableHeaders {
  [key: string]: string | TableHeadersOptions
}

export const Row = (props: { id?: string; className?: string; children: React.ReactNode }) => (
  <tr id={props.id} className={props.className}>
    {props.children}
  </tr>
)

export const HeaderCell = (props: { children: React.ReactNode; className?: string }) => (
  <th className={props.className}>{props.children}</th>
)

export const Cell = (props: {
  headerLabel?: string | TableHeadersOptions
  className?: string
  colSpan?: number
  children: React.ReactNode
}) => (
  <td
    data-label={props.headerLabel instanceof Object ? props.headerLabel?.name : props.headerLabel}
    className={props.className || "p-5"}
    colSpan={props.colSpan}
  >
    {props.children}
  </td>
)

export const TableThumbnail = (props: { children: React.ReactNode }) => {
  return <span className="table__thumbnail">{props.children}</span>
}

export interface StandardTableProps {
  draggable?: boolean
  setData?: (data: unknown[]) => void
  headers: TableHeaders
  data: StandardTableData
  tableClassName?: string
  cellClassName?: string
  responsiveCollapse?: boolean
  translateData?: boolean
}

export type StandardTableData = Record<string, React.ReactNode>[] | undefined

const headerName = (header: string | TableHeadersOptions) => {
  if (typeof header === "string") {
    return header
  } else {
    return header.name
  }
}
const headerClassName = (header: string | TableHeadersOptions) => {
  if (typeof header === "string") {
    return ""
  } else {
    return header.className
  }
}

export const StandardTable = (props: StandardTableProps) => {
  const { headers = {}, cellClassName } = props

  const [tableData, setTableData] = useState<StandardTableData>()

  const headerLabels = Object.values(headers)?.map((header, index) => {
    const uniqKey = process.env.NODE_ENV === "test" ? `header-${index}` : nanoid()
    return (
      <HeaderCell key={uniqKey} className={headerClassName(header)}>
        {getTranslationWithArguments(headerName(header))}
      </HeaderCell>
    )
  })

  useEffect(() => {
    setTableData(props.data)
  }, [props.data])

  if (props.draggable) {
    headerLabels.splice(
      0,
      0,
      <th key={"header-draggable"} className={"table__draggable-cell pl-5"}>
        {t("t.sort")}
      </th>
    )
  }

  const body = tableData?.map((row: Record<string, React.ReactNode>, dataIndex) => {
    const rowKey = row["id"]
      ? `row-${row["id"] as string}`
      : process.env.NODE_ENV === "test"
      ? `standardrow-${dataIndex}`
      : nanoid()

    const cols = Object.keys(headers)?.map((colKey, colIndex) => {
      const uniqKey = process.env.NODE_ENV === "test" ? `standardcol-${colIndex}` : nanoid()
      const cell = row[colKey]

      const cellClass = [cellClassName, headerClassName(headers[colKey])].join(" ")

      return (
        <Cell
          key={uniqKey}
          headerLabel={getTranslationWithArguments(headerName(headers[colKey]))}
          className={cellClass !== " " ? cellClass : undefined}
        >
          {props.translateData && typeof cell === "string"
            ? getTranslationWithArguments(cell)
            : cell}
        </Cell>
      )
    })
    if (props.draggable) {
      cols.splice(
        0,
        0,
        <Cell
          key={`${dataIndex}-draggable`}
          headerLabel={t("t.sort")}
          className={`table__draggable-cell pl-5`}
        >
          <Icon symbol={"draggable"} size={"medium"} />
        </Cell>
      )
    }
    return (
      <React.Fragment key={rowKey}>
        {props.draggable ? (
          <Draggable draggableId={rowKey} index={dataIndex} key={rowKey}>
            {(provided, snapshot) => (
              <tr
                key={rowKey}
                id={rowKey}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                // eslint-disable-next-line @typescript-eslint/unbound-method
                ref={provided.innerRef}
                className={snapshot.isDragging ? "table__is-dragging" : ""}
              >
                {cols}
              </tr>
            )}
          </Draggable>
        ) : (
          <tr id={rowKey} key={rowKey}>
            {cols}
          </tr>
        )}
      </React.Fragment>
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
    list: Record<string, React.ReactNode>[] | undefined,
    startIndex: number,
    endIndex: number
  ) => {
    if (!list) return

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
    if (props.setData && reorderedTableData) {
      props.setData(reorderedTableData)
    }
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className={tableClasses.join(" ")}>
        <thead>
          <tr>{headerLabels}</tr>
        </thead>
        {props.draggable ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="standard-table">
              {(provided) => (
                // eslint-disable-next-line @typescript-eslint/unbound-method
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {body}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <tbody>{body}</tbody>
        )}
      </table>
    </div>
  )
}
