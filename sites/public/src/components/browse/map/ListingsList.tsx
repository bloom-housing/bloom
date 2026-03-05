import * as React from "react"
import { Button, Heading } from "@bloom-housing/ui-seeds"
import { LoadingOverlay, t, InfoCard } from "@bloom-housing/ui-components"
import { getMapListings } from "../../../lib/helpers"
import { Pagination } from "./Pagination"
import { useListingsMapContext } from "./ListingsMapContext"
import styles from "./ListingsCombined.module.scss"

type ListingsListProps = {
  loading?: boolean
}

const ListingsList = (props: ListingsListProps) => {
  const { searchResults, onPageChange, isLoading } = useListingsMapContext()
  const loading = props.loading ?? isLoading
  const moreMarkersOnMap = searchResults.markers.length > 0

  const listingsDiv = (
    <div id="listingsList">
      <Heading className={"sr-only"} priority={2}>
        {t("t.listingsList")}
      </Heading>
      <div
        className={`${styles["listings-list-container"]} ${
          searchResults.listings.length === 0 && styles["listings-list-container-empty"]
        }`}
      >
        {searchResults.listings.length > 0 || loading ? (
          getMapListings(searchResults.listings)
        ) : (
          <>
            {moreMarkersOnMap ? (
              <>
                <Heading priority={2} size={"xl"} className={"seeds-m-be-header"}>
                  {t("t.noVisibleListings")}
                </Heading>
                <div>{t("t.tryChangingArea")}</div>
              </>
            ) : (
              <>
                <Heading priority={2} size={"xl"} className={"seeds-m-be-header"}>
                  {t("t.noMatchingListings")}
                </Heading>
                <div>{t("t.tryRemovingFilters")}</div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )

  const infoCards = (
    <div className={styles["info-cards-container"]}>
      {process.env.notificationsSignUpUrl && (
        <InfoCard
          title={t("t.signUpForAlerts")}
          subtitle={t("t.subscribeToListingAlerts")}
          className="is-normal-primary-lighter"
        >
          <Button
            href={process.env.notificationsSignUpUrl}
            className="is-primary"
            hideExternalLinkIcon={true}
          >
            {t("t.signUp")}
          </Button>
        </InfoCard>
      )}
      {/* // Map TODO: Create customizable info cards */}
    </div>
  )

  const pagination =
    searchResults.lastPage !== 0 ? (
      <Pagination
        currentPage={searchResults.currentPage}
        lastPage={searchResults.lastPage}
        onPageChange={onPageChange}
      />
    ) : (
      <></>
    )
  return (
    <section className={styles["listings-list-wrapper"]} aria-label="Listings list">
      <LoadingOverlay isLoading={loading}>{listingsDiv}</LoadingOverlay>
      {pagination}
      {infoCards}
    </section>
  )
}
export { ListingsList as default, ListingsList }
