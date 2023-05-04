import * as React from "react"
import { StackedTable, StackedTableProps } from "./StackedTable"
import { Heading } from "../text/Heading"

export interface CategoryTableSection {
  /** The header text for a category */
  header: string
  /** The table data for a category */
  tableData: StackedTableProps
}

export interface CategoryTableProps {
  /** The table data passed as category section strings associated with a table data set */
  categoryData: CategoryTableSection[]
}

const CategoryTable = (props: CategoryTableProps) => {
  const tables = props.categoryData.map((category, index) => {
    return (
      <div key={index} className={"category-table-container"}>
        <Heading priority={3} styleType={"lightWeighted"}>
          {category.header}
        </Heading>
        <hr className={"mt-3 mb-3 md:mb-1 border-gray-500"} />
        <StackedTable {...category.tableData} className={"category-table"} />
      </div>
    )
  })

  return <div className={"category-table-parent"}>{tables}</div>
}

export { CategoryTable as default, CategoryTable }
