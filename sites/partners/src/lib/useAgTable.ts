import { useState } from "react"

export interface ColumnOrder {
  orderBy: string
  orderDir: string
}

const AG_PER_PAGE_OPTIONS = [8, 25, 50, 100]

export const useAgTable = () => {
  const [sortOptions, setSortOptions] = useState<ColumnOrder[]>([])
  const [filterValue, setFilterValue] = useState("")

  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState<number>(1)

  return {
    filter: {
      filterValue,
      setFilterValue,
    },
    sort: {
      sortOptions,
      setSortOptions,
    },
    pagination: {
      itemsPerPage,
      setItemsPerPage,
      currentPage,
      setCurrentPage,
    },
  }
}
