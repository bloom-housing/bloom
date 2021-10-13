import * as React from "react"
import { TableHeaders } from "./StandardTable"
import { MinimalTable } from "./MinimalTable"

export interface StackedTableRow {
  cellText: string
  cellSubText?: string
  hideMobile?: boolean
}

export interface StackedTableProps {
  headers: TableHeaders
  headersHiddenDesktop?: string[]
  stackedData?: Record<string, StackedTableRow>[]
  className?: string
}

const StackedTable = (props: StackedTableProps) => {
  const tableClasses = ["base", props.className]
  const modifiedData: Record<string, React.ReactNode>[] = []
  const cellTextClass = "font-semibold text-gray-750"
  const cellSubtextClass = "text-sm text-gray-700"
  props.stackedData?.forEach((dataRow) => {
    const dataCell = Object.keys(dataRow).reduce((acc, item) => {
      acc[item] = (
        <div
          className={`md:flex md:flex-col ${
            props.headersHiddenDesktop?.includes(item) && "md:hidden"
          }`}
        >
          <span className={`${cellTextClass}`}>{dataRow[item].cellText}</span>
          <span
            className={`pl-1 md:pl-0 ${
              dataRow[item].hideMobile && "hidden md:block"
            } ${cellSubtextClass}`}
          >
            {dataRow[item].cellSubText}
          </span>
        </div>
      )
      return acc
    }, {})
    modifiedData.push(dataCell)
  })

  const modifiedHeaders = Object.keys(props.headers).reduce((acc, headerKey) => {
    if (props.headersHiddenDesktop?.includes(headerKey)) {
      let headerClasses = "md:hidden"
      const headerObj = props.headers[headerKey]
      headerClasses = `${headerObj["className"] && headerObj["className"]} ${headerClasses}`
      acc[headerKey] = { name: headerObj["name"] ?? headerObj, className: headerClasses }
    } else {
      acc[headerKey] = props.headers[headerKey]
    }
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
