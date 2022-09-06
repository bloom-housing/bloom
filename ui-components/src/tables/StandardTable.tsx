import React, { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import { nanoid } from "nanoid"
import { faGripLines } from "@fortawesome/free-solid-svg-icons"
import { getTranslationWithArguments } from "../helpers/getTranslationWithArguments"
import { Icon, IconFillColors } from "../icons/Icon"
import { t } from "../helpers/translator"

export interface TableHeadersOptions {
  name: string
  mobileReplacement?: string
  className?: string
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
  mobileReplacement?: string | React.ReactNode
}) => (
  <td
    data-label={props.headerLabel instanceof Object ? props.headerLabel?.name : props.headerLabel}
    data-cell={props.mobileReplacement}
    className={props.className || "p-5"}
    colSpan={props.colSpan}
  >
    {props.children}
  </td>
)

export const TableThumbnail = (props: { children: React.ReactNode }) => {
  return <span className="table__thumbnail">{props.children}</span>
}

export type StandardTableCell = {
  /** The main content of the cell */
  content: React.ReactNode
  /** Text content that will replace this cell's header on mobile views */
  mobileReplacement?: string
  /** Classname to apply to this row */
  rowClass?: string
}

export type StandardTableData = Record<string, StandardTableCell>[]

export interface StandardTableProps {
  /** If the table should be sortable through dragging */
  draggable?: boolean
  /** A set state function tied to the table's data, used if the table is draggable */
  setData?: (data: unknown[]) => void
  /** The headers for the table passed as text content with optional settings */
  headers: TableHeaders
  /** The table data passed as records of column name to cell data with optional settings */
  data?: StandardTableData
  /** A class name applied to the root of the table */
  tableClassName?: string
  /** A class name applied to each cell */
  cellClassName?: string
  /** If the table should collapse on mobile views to show repeating columns on the left for every row */
  responsiveCollapse?: boolean
  /** If cell text should be translated or left raw */
  translateData?: boolean
  /** An id applied to the table */
  id?: string
  strings?: {
    orderString?: string
    sortString?: string
  }
}

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
        {header && header !== "" ? getTranslationWithArguments(headerName(header)) : header}
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
      <th key={"header-draggable"}>{props.strings?.orderString ?? t("t.order")}</th>
    )
    headerLabels.splice(
      0,
      0,
      <th key={"header-draggable"} className={"table__draggable-cell pl-5"}>
        {props.strings?.sortString ?? t("t.sort")}
      </th>
    )
  }

  const body = tableData?.map((row, dataIndex) => {
    const rowKey = row["id"]
      ? `row-${row["id"].content as string}`
      : process.env.NODE_ENV === "test"
      ? `standardrow-${dataIndex}`
      : nanoid()

    let rowClass: string | undefined = ""
    const cols = Object.keys(headers)?.map((colKey, colIndex) => {
      const uniqKey = process.env.NODE_ENV === "test" ? `standardcol-${colIndex}` : nanoid()
      const cell = row[colKey]?.content
      rowClass = row[colKey]?.rowClass ? row[colKey].rowClass : ""

      const cellClass = [headerClassName(headers[colKey]), cellClassName].join(" ")

      return (
        <Cell
          key={uniqKey}
          headerLabel={
            headers[colKey] && headers[colKey] !== ""
              ? getTranslationWithArguments(headerName(headers[colKey]))
              : headers[colKey]
          }
          className={cellClass !== " " ? cellClass : undefined}
          mobileReplacement={row[colKey]?.mobileReplacement}
        >
          {props.translateData && typeof cell === "string" && cell !== ""
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
          key={`${dataIndex}-order-draggable`}
          headerLabel={props.strings?.sortString ?? t("t.sort")}
          className={`pl-5 ${cellClassName ?? undefined}`}
        >
          {dataIndex + 1}
        </Cell>
      )
      cols.splice(
        0,
        0,
        <Cell
          key={`${dataIndex}-sort-draggable`}
          headerLabel={props.strings?.sortString ?? t("t.sort")}
          className={`table__draggable-cell pl-7`}
        >
          <Icon symbol={faGripLines} size={"medium"} fill={IconFillColors.primary} />
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
          <tr id={rowKey} key={rowKey} className={rowClass ? rowClass : ""}>
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

  const reorder = (list: StandardTableData | undefined, startIndex: number, endIndex: number) => {
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
      <table id={props.id} className={tableClasses.join(" ")}>
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
