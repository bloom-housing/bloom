import React from "react"
import { MapIcon, ListBulletIcon, FunnelIcon } from "@heroicons/react/24/solid"
import { t } from "@bloom-housing/ui-components"
import { Button, Icon } from "@bloom-housing/ui-seeds"
import { useListingsMapContext } from "./ListingsMapContext"
import styles from "./ListingsSearch.module.scss"

export const ListingsSearchMetadata = () => {
  const { isLoading, setFilterDrawerOpen, filterCount, searchResults, setListView, listView } =
    useListingsMapContext()

  const isInitialLoad = isLoading && searchResults.currentPage === 0

  return (
    <section role="contentinfo" aria-label="Listing filter bar">
      <div className={`${styles["search-filter-bar"]} ${styles["search-switch-container"]}`}>
        <>
          <Button
            size={"sm"}
            onClick={() => setListView(!listView)}
            variant="primary-outlined"
            className={`results-bar-button ${styles["switch-view-button"]}`}
            leadIcon={
              listView ? (
                <Icon>
                  <MapIcon />
                </Icon>
              ) : (
                <Icon>
                  <ListBulletIcon />
                </Icon>
              )
            }
          >
            {listView ? t("t.mapMapView") : t("t.mapListView")}
          </Button>
          <Button
            variant="primary-outlined"
            size="sm"
            className={`results-bar-button ${styles["switch-view-button"]} ${styles["filter-desktop"]}`}
            onClick={() => {
              setFilterDrawerOpen(true)
            }}
            leadIcon={
              <Icon>
                <FunnelIcon />
              </Icon>
            }
          >
            <strong>
              {t("search.filters")} {filterCount}
            </strong>
          </Button>
        </>
      </div>
      <div className={`${styles["search-filter-bar"]}`}>
        <div className={`${styles["total-results"]}`}>
          <span className={`${styles["search-total-results"]}`} data-testid={"map-total-results"}>
            {!isInitialLoad && (
              <>
                <strong>{t("search.totalResults")}</strong> {searchResults.totalItems}
              </>
            )}
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
            setFilterDrawerOpen(true)
          }}
          id={"listings-map-filter-button"}
        >
          <strong>{t("search.filters")}</strong>{" "}
          <span className={styles["filter-count"]}>{filterCount}</span>
        </Button>
      </div>
    </section>
  )
}
