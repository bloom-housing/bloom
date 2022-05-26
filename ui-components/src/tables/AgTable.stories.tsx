import React from "react"

import { AgTable, useAgTable } from "./AgTable"

const agTableMockColumns = [
  {
    headerName: "Name",
    field: "name",
  },
  {
    headerName: "Value",
    field: "value",
  },
]

const agTableMockData = Array.from({ length: 10 }).map((_, index) => ({
  name: `${index + 1} row`,
  value: `${index + 1}`,
}))

const getTableMockData = (page: number, perPage: number, search: string) => {
  // in story works by name only
  if (search) {
    return agTableMockData.filter((item) => item.name.includes(search))
  }

  if (page === 1) return agTableMockData.slice(0, perPage)
  if (page === 2) return agTableMockData.slice(perPage, agTableMockData.length)

  return agTableMockData
}

export default {
  title: "Tables/AgTable",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  component: AgTable,
}

export const Default = () => {
  const tableOptions = useAgTable()
  const tableItems = getTableMockData(
    tableOptions.pagination.currentPage,
    tableOptions.pagination.itemsPerPage,
    tableOptions.filter.filterValue
  )

  return (
    <AgTable
      id="test-table"
      pagination={{
        perPage: tableOptions.pagination.itemsPerPage,
        setPerPage: tableOptions.pagination.setItemsPerPage,
        currentPage: tableOptions.pagination.currentPage,
        setCurrentPage: tableOptions.pagination.setCurrentPage,
      }}
      config={{
        columns: agTableMockColumns,
        totalItemsLabel: "Total items",
      }}
      data={{
        items: tableItems,
        loading: false,
        totalItems: agTableMockData.length,
        totalPages: Math.ceil(agTableMockData.length / tableOptions.pagination.itemsPerPage),
      }}
      search={{
        setSearch: tableOptions.filter.setFilterValue,
      }}
      sort={{
        setSort: tableOptions.sort.setSortOptions,
      }}
      headerContent={<div className="flex-row">right content</div>}
    />
  )
}
