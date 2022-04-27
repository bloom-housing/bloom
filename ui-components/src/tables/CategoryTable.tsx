import * as React from "react"
import { StackedTable, StackedTableProps } from "./StackedTable"
import { Heading } from "../headers/Heading"

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
        <Heading priority={3} style={"categoryHeader"}>
          {category.header}
        </Heading>
        <hr className={"my-2"} />
        <StackedTable {...category.tableData} className={"category-table"} />
      </div>
    )
  })

  return <div className={"categories-container"}>{tables}</div>
}

export { CategoryTable as default, CategoryTable }
