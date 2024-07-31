import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import styles from "./ListingsSearch.module.scss"

export interface ListingsSearchMetadataProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  filterCount: number
  searchResults: {
    listings: any[]
    currentPage: number
    lastPage: number
    totalItems: number
    loading: boolean
  }
}

export const ListingsSearchMetadata = ({
  setModalOpen,
  filterCount,
  searchResults,
}: ListingsSearchMetadataProps) => {
  return (
    <div className={styles["search-filter-bar"]}>
      <span className={styles["search-total-results"]}>
        <strong>{t("search.totalResults")}</strong> {searchResults.totalItems}
      </span>
      <span>
        ({t("t.pageXofY", { current: searchResults.currentPage, total: searchResults.lastPage })})
      </span>
      <Button
        variant="primary-outlined"
        size="sm"
        onClick={() => {
          setModalOpen(true)
        }}
      >
        {`${t("search.filters")} ${filterCount}`}
      </Button>
    </div>
  )
}
