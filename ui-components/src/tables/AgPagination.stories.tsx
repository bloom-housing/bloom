import React from "react"
import { AgPagination } from "./AgPagination"

export default {
  title: "Tables/Pagination",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <AgPagination
    totalItems={100}
    totalPages={4}
    currentPage={2}
    itemsPerPage={25}
    quantityLabel={"Items"}
    setCurrentPage={() => {}}
    setItemsPerPage={() => {}}
  />
)
