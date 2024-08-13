import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import styles from "./ListingsSearch.module.scss"

export interface ListingsSearchMetadataProps {
  loading: boolean
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
  loading,
  setModalOpen,
  filterCount,
  searchResults,
}: ListingsSearchMetadataProps) => {
  return (
    <div className={styles["search-filter-bar"]}>
      <span className={styles["search-total-results"]}>
        <strong>{t("search.totalResults")}</strong> {!loading && searchResults.totalItems}
      </span>
      {!loading && searchResults.lastPage > 0 && (
        <span>
          ({t("t.pageXofY", { current: searchResults.currentPage, total: searchResults.lastPage })})
        </span>
      )}
      <Button
        variant="primary-outlined"
        size="sm"
        className={styles["search-filters-button"]}
        onClick={() => {
          setModalOpen(true)
        }}
      >
        <strong>{t("search.filters")}</strong>
        {filterCount}
      </Button>
    </div>
  )
}
