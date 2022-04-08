import * as React from "react"
import { StackedTable, StackedTableProps } from "./StackedTable"
import { Heading } from "../headers/Heading"

export interface CategoryTableSection {
  header: string
  tableData: StackedTableProps
}

export interface CategoryTableProps {
  categoryData: CategoryTableSection[]
  className?: string
}

const CategoryTable = (props: CategoryTableProps) => {
  const tables = props.categoryData.map((category) => {
    return (
      <>
        <Heading priority={3} style={"categoryHeader"}>
          {category.header}
        </Heading>
        <hr className={"my-2"} />
        <StackedTable {...category.tableData} categories={true} className={"category-table mb-8"} />
      </>
    )
  })

  return <>{tables}</>
}

export { CategoryTable as default, CategoryTable }
