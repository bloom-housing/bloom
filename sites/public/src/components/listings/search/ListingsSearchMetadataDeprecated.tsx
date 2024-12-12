import React from "react"
import { FunnelIcon } from "@heroicons/react/24/solid"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import { Button, Icon } from "@bloom-housing/ui-seeds"
import styles from "./ListingsSearchDeprecated.module.scss"

export interface ListingsSearchMetadataProps {
  loading: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  filterCount: number
  searchResults: {
    listings: Listing[]
    currentPage: number
    lastPage: number
    totalItems: number
  }
}

export const ListingsSearchMetadata = ({
  setModalOpen,
  filterCount,
  searchResults,
}: ListingsSearchMetadataProps) => {
  return (
    <section role="contentinfo" aria-label="Listing filter bar">
      <div className={`${styles["search-filter-bar"]} ${styles["search-switch-container"]}`}>
        <>
          <Button
            variant="primary-outlined"
            size="sm"
            className={`results-bar-button ${styles["switch-view-button"]} ${styles["filter-desktop"]}`}
            onClick={() => {
              setModalOpen(true)
            }}
            leadIcon={
              <Icon>
                <FunnelIcon />
              </Icon>
            }
          >
            <strong>{t("search.filters")}</strong> {filterCount}
          </Button>
        </>
      </div>
      <div className={`${styles["search-filter-bar"]}`}>
        <div className={`${styles["total-results"]}`}>
          <span className={`${styles["search-total-results"]}`} data-testid={"map-total-results"}>
            <strong>{t("search.totalResults")}</strong> {searchResults.totalItems}
          </span>
          {searchResults.lastPage > 0 && (
            <span data-testid={"map-pagination"}>
              (
              {t("t.pageXofY", {
                current: searchResults.currentPage,
                total: searchResults.lastPage,
              })}
              )
            </span>
          )}
        </div>
        <Button
          variant="primary-outlined"
          size="sm"
          className={`results-bar-button ${styles["filter-mobile"]}`}
          onClick={() => {
            setModalOpen(true)
          }}
          id={"listings-map-filter-button"}
        >
          <strong>{t("search.filters")}</strong> {filterCount}
        </Button>
      </div>
    </section>
  )
}
