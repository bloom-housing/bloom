import * as React from "react"
import { BloomCard, tIfExists } from "@bloom-housing/shared-helpers"
import { Button, Card, Heading } from "@bloom-housing/ui-seeds"
import { LoadingOverlay, t } from "@bloom-housing/ui-components"
import {
  FeatureFlagEnum,
  ListingFilterKeys,
  ListingsStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { getMapListings } from "../../../lib/helpers"
import { Pagination } from "./Pagination"
import { useListingsMapContext } from "./ListingsMapContext"
import styles from "./ListingsCombined.module.scss"
import { useRouter } from "next/router"

type ListingsListProps = {
  loading?: boolean
}

const ListingsList = (props: ListingsListProps) => {
  const router = useRouter()
  const {
    searchResults,
    onPageChange,
    isLoading,
    activeFeatureFlags,
    notificationsSignUpUrl,
    listingStatus,
  } = useListingsMapContext()
  const loading = props.loading ?? isLoading
  const moreMarkersOnMap = searchResults.markers.length > 0

  const enableFilterByStatus = activeFeatureFlags?.includes(FeatureFlagEnum.enableFilterByStatus)
  const enableCustomListingNotifications = activeFeatureFlags?.includes(
    FeatureFlagEnum.enableCustomListingNotifications
  )

  const onSearchClick = React.useCallback(() => {
    const newQuery = { ...router.query }
    newQuery[ListingFilterKeys.status] =
      listingStatus === ListingsStatusEnum.active
        ? ListingsStatusEnum.closed
        : ListingsStatusEnum.active

    void router.push(`/listings`, {
      query: {
        ...router.query,
      },
    })
  }, [listingStatus, router])

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
                  {enableFilterByStatus
                    ? t("listingFilters.noMatchingListingsTitle")
                    : t("t.noVisibleListings")}
                </Heading>
                {t("t.tryChangingArea")}
              </>
            ) : (
              <>
                <Heading priority={2} size={"xl"} className={"seeds-m-be-header"}>
                  {t("t.noMatchingListings")}
                </Heading>
                {enableFilterByStatus ? (
                  <>
                    <p className={styles["listings-subheader"]}>
                      {t("listingFilters.noMatchingListingsDescription")}
                    </p>
                    <Button
                      className={"mt-4"}
                      variant="primary-outlined"
                      onClick={onSearchClick}
                      size="sm"
                    >
                      {listingStatus === ListingsStatusEnum.active
                        ? t("listingFilters.searchForClosed")
                        : t("listingFilters.searchForOpen")}
                    </Button>
                  </>
                ) : (
                  <div>{t("t.tryRemovingFilters")}</div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )

  const showNotificationsCard = enableCustomListingNotifications || !!notificationsSignUpUrl

  const otherCards = []
  let hasAdditionalCards = true
  while (hasAdditionalCards) {
    const index = otherCards.length + 1
    if (tIfExists(`listingResource.additionalCard${index}.title`)) {
      otherCards.push(
        <div className={styles["listings-list-info-card"]} key={`additional-card-${index}`}>
          <BloomCard
            title={t(`listingResource.additionalCard${index}.title`)}
            variant="block"
            headingPriority={3}
            headingClass={styles["listing-resource-header"]}
            iconClass="card-icon"
            subtitle={tIfExists(`listingResource.additionalCard${index}.subtext`)}
          >
            <Card.Section>
              <Button
                href={t(`listingResource.additionalCard${index}.link`)}
                variant="primary-outlined"
                size="sm"
              >
                {t(`listingResource.additionalCard${index}.linkLabel`)}
              </Button>
            </Card.Section>
          </BloomCard>
        </div>
      )
    } else {
      hasAdditionalCards = false
    }
  }

  const infoCards = (
    <div className={styles["listings-list-info-cards"]}>
      {showNotificationsCard && (
        <div className={styles["listings-list-info-card"]}>
          <BloomCard
            title={t("welcome.signUp")}
            variant="block"
            headingPriority={3}
            headingClass={styles["listing-resource-header"]}
            iconClass="card-icon"
          >
            <Card.Section>
              <Button
                href={
                  enableCustomListingNotifications
                    ? "/account/notifications"
                    : notificationsSignUpUrl
                }
                variant="primary-outlined"
                size="sm"
              >
                {t("welcome.signUpToday")}
              </Button>
            </Card.Section>
          </BloomCard>
        </div>
      )}
      {activeFeatureFlags?.includes(FeatureFlagEnum.enableResources) && (
        <div className={styles["listings-list-info-card"]}>
          <BloomCard
            title={t("welcome.seeMoreOpportunitiesTruncated")}
            variant="block"
            headingPriority={3}
            headingClass={styles["listing-resource-header"]}
            iconClass="card-icon"
          >
            <Card.Section>
              <Button href="/additional-resources" variant="primary-outlined" size="sm">
                {t("welcome.viewAdditionalHousingTruncated")}
              </Button>
            </Card.Section>
          </BloomCard>
        </div>
      )}
      {activeFeatureFlags?.includes(FeatureFlagEnum.enableAdditionalResources) && (
        <div className={styles["listings-list-info-card"]}>
          <BloomCard
            title={t("resources.additionalResourcesTitle")}
            variant="block"
            headingPriority={3}
            headingClass={styles["listing-resource-header"]}
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
        </div>
      )}
      {otherCards}
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
