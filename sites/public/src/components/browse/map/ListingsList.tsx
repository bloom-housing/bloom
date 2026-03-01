import * as React from "react"
import { Listing, ListingMapMarker } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Heading } from "@bloom-housing/ui-seeds"
import { LoadingOverlay, t, InfoCard } from "@bloom-housing/ui-components"
import { getMapListings } from "../../../lib/helpers"
import { Pagination } from "./Pagination"
import styles from "./ListingsCombined.module.scss"

type ListingsListProps = {
  listings: Listing[]
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
  loading: boolean
  mapMarkers: ListingMapMarker[] | null
}

const ListingsList = (props: ListingsListProps) => {
  const moreMarkersOnMap = props.mapMarkers.length > 0

  const listingsDiv = (
    <div id="listingsList">
      <Heading className={"sr-only"} priority={2}>
        {t("t.listingsList")}
      </Heading>
      <div
        className={`${styles["listings-list-container"]} ${
          props.listings.length === 0 && styles["listings-list-container-empty"]
        }`}
      >
        {props.listings.length > 0 || props.loading ? (
          getMapListings(props.listings)
        ) : (
          <>
            {moreMarkersOnMap ? (
              <>
                <Heading priority={2} size={"xl"}>
                  {t("t.noVisibleListings")}
                </Heading>
                <div>{t("t.tryChangingArea")}</div>
              </>
            ) : (
              <>
                <Heading priority={2} size={"xl"}>
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
      {/* // Map TODO: Create actual info cards */}
      {/* <InfoCard
        title={t("t.needHelp")}
        subtitle={t("t.emergencyShelter")}
        className="is-normal-secondary-lighter"
      >
        <Button href="/help/housing-help" className="capitalize" variant="secondary">
          {t("t.helpCenter")}
        </Button>
      </InfoCard> */}
    </div>
  )

  const pagination =
    props.lastPage !== 0 ? (
      <Pagination
        currentPage={props.currentPage}
        lastPage={props.lastPage}
        onPageChange={props.onPageChange}
      />
    ) : (
      <></>
    )
  return (
    <section className={styles["listings-list-wrapper"]} aria-label="Listings list">
      <LoadingOverlay isLoading={props.loading}>{listingsDiv}</LoadingOverlay>
      {pagination}
      {infoCards}
    </section>
  )
}
export { ListingsList as default, ListingsList }
