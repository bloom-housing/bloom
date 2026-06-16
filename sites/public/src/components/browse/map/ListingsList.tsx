import * as React from "react"
import { BloomCard } from "@bloom-housing/shared-helpers"
import { Button, Card, Heading } from "@bloom-housing/ui-seeds"
import { LoadingOverlay, t } from "@bloom-housing/ui-components"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { getMapListings } from "../../../lib/helpers"
import { Pagination } from "./Pagination"
import { useListingsMapContext } from "./ListingsMapContext"
import styles from "./ListingsCombined.module.scss"

type ListingsListProps = {
  loading?: boolean
}

const ListingsList = (props: ListingsListProps) => {
  const { searchResults, onPageChange, isLoading, activeFeatureFlags, notificationsSignUpUrl } =
    useListingsMapContext()
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

  const enableCustomListingNotifications = activeFeatureFlags?.includes(
    FeatureFlagEnum.enableCustomListingNotifications
  )
  const showNotificationsCard = enableCustomListingNotifications || !!notificationsSignUpUrl

  const infoCards = (
    <div className={styles["listings-list-info-cards"]}>
      {showNotificationsCard && (
        <BloomCard
          iconSymbol="envelope"
          title={t("welcome.signUp")}
          variant="block"
          headingPriority={3}
          iconClass="card-icon"
        >
          <Card.Section>
            <Button
              href={
                enableCustomListingNotifications ? "/account/notifications" : notificationsSignUpUrl
              }
              variant="primary-outlined"
              size="sm"
            >
              {t("welcome.signUpToday")}
            </Button>
          </Card.Section>
        </BloomCard>
      )}
      {activeFeatureFlags?.includes(FeatureFlagEnum.enableResources) && (
        <BloomCard
          iconSymbol="house"
          title={t("welcome.seeMoreOpportunitiesTruncated")}
          variant="block"
          headingPriority={3}
          iconClass="card-icon"
        >
          <Card.Section>
            <Button href="/additional-resources" variant="primary-outlined" size="sm">
              {t("welcome.viewAdditionalHousingTruncated")}
            </Button>
          </Card.Section>
        </BloomCard>
      )}
      {activeFeatureFlags?.includes(FeatureFlagEnum.enableAdditionalResources) && (
        <BloomCard
          iconSymbol="questionMarkCircle"
          title={t("resources.additionalResourcesTitle")}
          variant="block"
          headingPriority={3}
          iconClass="card-icon"
        >
          <Card.Section>
            <Button
              href={t("resources.additionalResourcesLink")}
              variant="primary-outlined"
              size="sm"
            >
              {t("welcome.learnMore")}
            </Button>
          </Card.Section>
        </BloomCard>
      )}
      {/* TODO: add the Looking for housing in San Francisco? card here */}
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
