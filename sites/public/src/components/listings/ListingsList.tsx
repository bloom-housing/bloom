import * as React from "react"
import { Listing, ListingMapMarker } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Heading } from "@bloom-housing/ui-seeds"
import { ZeroListingsItem } from "@bloom-housing/doorway-ui-components"
import { LoadingOverlay, t, InfoCard, LinkButton } from "@bloom-housing/ui-components"
import { getListings } from "../../lib/helpers"
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
      {props.listings.length > 0 || props.loading ? (
        <div className={styles["listings-list-container"]}>{getListings(props.listings)}</div>
      ) : (
        <ZeroListingsItem
          title={moreMarkersOnMap ? t("t.noVisibleListings") : t("t.noMatchingListings")}
          description={moreMarkersOnMap ? t("t.tryChangingArea") : t("t.tryRemovingFilters")}
        />
      )}
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
          <LinkButton
            href={process.env.notificationsSignUpUrl}
            newTab={true}
            className="is-primary"
          >
            {t("t.signUp")}
          </LinkButton>
        </InfoCard>
      )}
      <InfoCard
        title={t("t.needHelp")}
        subtitle={t("t.emergencyShelter")}
        className="is-normal-secondary-lighter"
      >
        <LinkButton href="/help/housing-help" className="is-secondary">
          {t("t.helpCenter")}
        </LinkButton>
      </InfoCard>
      <InfoCard
        title={t("t.housingInSanFrancisco")}
        subtitle={t("t.seeSanFranciscoListings")}
        className="is-normal-secondary-lighter"
      >
        <LinkButton href="https://housing.sfgov.org/" newTab={true} className="is-secondary">
          {t("t.seeListings")}
        </LinkButton>
      </InfoCard>
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
