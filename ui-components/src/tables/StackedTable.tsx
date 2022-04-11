import * as React from "react"
import { StandardTableData, TableHeaders } from "./StandardTable"
import { MinimalTable } from "./MinimalTable"

export interface StackedTableRow {
  cellText: string
  cellSubText?: string
  hideMobile?: boolean
  responsiveReplacement?: string
}

export interface StackedTableProps {
  headers: TableHeaders
  headersHiddenDesktop?: string[]
  stackedData?: Record<string, StackedTableRow>[]
  categories?: boolean
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
              className={`stacked-table-subtext  ${dataRow[item].hideMobile && "hidden md:block"} `}
            >
              {dataRow[item].cellSubText}
            </span>
          </div>
        ),
        responsiveReplacement: dataRow[item].cellText,
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
      tempHeader = { name: tempHeader["name"] ?? tempHeader, className: headerClasses }
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
    />
  )
}

export { StackedTable as default, StackedTable }
