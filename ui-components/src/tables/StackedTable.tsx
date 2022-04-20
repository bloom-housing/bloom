import * as React from "react"
import { StandardTableData, TableHeaders } from "./StandardTable"
import { MinimalTable } from "./MinimalTable"

export interface StackedTableRow {
  /** The main text content of the cell */
  cellText: string
  /** The subtext of the cell, displayed beneath the main text */
  cellSubText?: string
  /** Hides this cell's subtext on mobile views */
  hideSubTextMobile?: boolean
  /** Text content that will replace this cell's header on mobile views */
  mobileReplacement?: string
}

export interface StackedTableProps {
  /** The headers for the table passed as text content with optional settings */
  headers: TableHeaders
  /** Headers hidden on desktop views */
  headersHiddenDesktop?: string[]
  /** The table data passed as records of column name to cell data */
  stackedData?: Record<string, StackedTableRow>[]
  /** A class name applied to the root of the table */
  className?: string
}

const StackedTable = (props: StackedTableProps) => {
  const tableClasses = ["base", "stacked-table", props.className]
  const modifiedData: StandardTableData = []

  props.stackedData?.forEach((dataRow) => {
    const dataCell = Object.keys(dataRow).reduce((acc, item) => {
      acc[item] = {
        content: (
          <div
            className={`stacked-table-cell-container ${
              props.headersHiddenDesktop?.includes(item) && "md:hidden"
            }`}
          >
            <span className={"stacked-table-cell"}>{dataRow[item].cellText}</span>
            <span
              className={`stacked-table-subtext  ${
                dataRow[item].hideSubTextMobile && "hidden md:block"
              } `}
            >
              {dataRow[item].cellSubText}
            </span>
          </div>
        ),
        mobileReplacement: dataRow[item].cellText,
      }
      return acc
    }, {})
    modifiedData.push(dataCell)
  })

  const modifiedHeaders = Object.keys(props.headers).reduce((acc, headerKey) => {
    let tempHeader = props.headers[headerKey]
    if (props.headersHiddenDesktop?.includes(headerKey)) {
      let headerClasses = "md:hidden"
      headerClasses = `${tempHeader["className"] && tempHeader["className"]} ${headerClasses}`
      tempHeader = {
        name: tempHeader["name"] ?? tempHeader,
        className: `stacked-table-header ${headerClasses}`,
      }
    } else {
      acc[headerKey] = props.headers[headerKey]
      tempHeader = {
        name: tempHeader["name"] ?? tempHeader,
        className: `${tempHeader["className"] && tempHeader["className"]} stacked-table-header`,
      }
    }
    acc[headerKey] = tempHeader
    return acc
  }, {})

  return (
    <MinimalTable
      headers={modifiedHeaders}
      data={modifiedData}
      className={tableClasses.join(" ")}
      responsiveCollapse={true}
      cellClassName={"b-0"}
    />
  )
}

export { StackedTable as default, StackedTable }
