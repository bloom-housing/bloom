import * as React from "react"
import { Card, Heading } from "@bloom-housing/ui-seeds"
import {
  FeatureFlagEnum,
  Jurisdiction,
  Listing,
  ListingsStatusEnum,
  MarketingTypeEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import listingStyles from "../ListingViewSeeds.module.scss"
import {
  getListingStatusMessage,
  getListingStatusMessageContent,
  isFeatureFlagOn,
} from "../../../lib/helpers"
import styles from "./Availability.module.scss"

type AvailabilityProps = {
  listing: Listing
  jurisdiction: Jurisdiction
}

export const getAvailabilitySubheading = (
  waitlistOpenSpots: number,
  unitsAvailable: number
): string => {
  if (waitlistOpenSpots) {
    return `${waitlistOpenSpots} ${t("listings.waitlist.openSlots")}`
  }
  if (unitsAvailable) {
    return `${unitsAvailable} ${unitsAvailable === 1 ? t("t.unit") : t("t.units")}`
  }
  return null
}

export const getAvailabilityContent = (
  reviewOrderType: ReviewOrderTypeEnum,
  status: ListingsStatusEnum
) => {
  switch (reviewOrderType) {
    case ReviewOrderTypeEnum.waitlist:
      return status !== ListingsStatusEnum.closed ? t("listings.waitlist.submitForWaitlist") : null
    case ReviewOrderTypeEnum.firstComeFirstServe:
      return t("listings.eligibleApplicants.FCFS")
    default:
      return t("listings.availableUnitsDescription")
  }
}

export const getAvailabilityHeading = (reviewOrderType: ReviewOrderTypeEnum) => {
  switch (reviewOrderType) {
    case ReviewOrderTypeEnum.lottery:
      return t("listings.lottery")
    case ReviewOrderTypeEnum.waitlist:
      return t("listings.waitlist.label")
    default:
      return t("listings.applicationFCFS")
  }
}

export const Availability = ({ listing, jurisdiction }: AvailabilityProps) => {
  const enableMarketingStatus = isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableMarketingStatus)
  const swapCommunityTypeWithPrograms = isFeatureFlagOn(
    jurisdiction,
    FeatureFlagEnum.swapCommunityTypeWithPrograms
  )
  const showAdditionalWaitlistFields = isFeatureFlagOn(
    jurisdiction,
    FeatureFlagEnum.enableWaitlistAdditionalFields
  )

  const statusMessage = getListingStatusMessageContent(
    listing.status,
    listing.applicationDueDate,
    enableMarketingStatus,
    listing.marketingType,
    listing.marketingSeason,
    listing.marketingDate,
    false
  )
  const content = getAvailabilityContent(listing.reviewOrderType, listing.status)
  const unitsAvailable =
    listing.unitGroups.length > 0
      ? listing.unitGroups.reduce((acc, curr) => acc + curr.totalAvailable, 0)
      : listing.unitsAvailable
  const subheading = getAvailabilitySubheading(
    showAdditionalWaitlistFields ? null : listing.waitlistOpenSpots,
    unitsAvailable
  )

  const hideAvailabilityDetails =
    listing.status === ListingsStatusEnum.closed ||
    (enableMarketingStatus && listing.marketingType === MarketingTypeEnum.comingSoon)

  const hasUnitGroupsWaitlistOpen = listing.unitGroups.some((group) => group.openWaitlist)

  return (
    <>
      <div className={styles["status-messages"]}>
        {hideAvailabilityDetails && (
          <div className={"seeds-m-be-content"}>
            {getListingStatusMessage(listing, jurisdiction, null, false, true)}
          </div>
        )}
      </div>
      <Card className={`${listingStyles["mobile-full-width-card"]}`}>
        <Card.Section divider="flush">
          <Heading priority={2} size={"lg"}>
            {t("t.availability")}
          </Heading>
        </Card.Section>

        <Card.Section divider={"flush"}>
          <Heading priority={3} size={"md"}>
            {enableMarketingStatus && listing.marketingType === MarketingTypeEnum.comingSoon
              ? t("listings.underConstruction")
              : getAvailabilityHeading(listing.reviewOrderType)}
          </Heading>
          {!hideAvailabilityDetails && (
            <p className={styles["bold-subheader"]}>
              {listing.reviewOrderType === ReviewOrderTypeEnum.waitlist
                ? t("listings.waitlist.isOpen")
                : t("listings.vacantUnitsAvailable")}
            </p>
          )}
          {statusMessage && (
            <p className={`${listingStyles["thin-heading-sm"]} seeds-m-bs-label`}>
              {statusMessage}
            </p>
          )}
          {content && <p className={"seeds-m-bs-label"}>{content}</p>}
          {subheading && <p className={`seeds-m-bs-label`}>{subheading}</p>}
        </Card.Section>
        {showAdditionalWaitlistFields && (
          <Card.Section divider="flush">
            <Heading size={"md"} priority={3}>
              {t("listings.waitlist.open")}
            </Heading>
            <p className={styles["bold-subheader"]}>
              {hasUnitGroupsWaitlistOpen
                ? t("listings.waitlist.isOpen")
                : t("listings.waitlist.isClosed")}
            </p>
            {hasUnitGroupsWaitlistOpen && (
              <p className={`${listingStyles["thin-heading-sm"]} seeds-m-b-label`}>
                {t("listings.waitlist.submitForWaitlist")}
              </p>
            )}
            {listing.waitlistCurrentSize && (
              <p className={"seeds-m-be-text"}>
                {`${listing.waitlistCurrentSize} ${t(
                  "listings.waitlist.currentSize"
                ).toLowerCase()}`}
              </p>
            )}
            {listing.waitlistOpenSpots && (
              <p className={`seeds-m-be-text ${styles["bold-text"]}`}>
                {`${listing.waitlistOpenSpots} ${t("listings.waitlist.openSlots").toLowerCase()}`}
              </p>
            )}
            {listing.waitlistMaxSize && (
              <p>{`${listing.waitlistMaxSize} ${t(
                "listings.waitlist.finalSize"
              ).toLowerCase()}`}</p>
            )}
          </Card.Section>
        )}
        {!swapCommunityTypeWithPrograms && listing.reservedCommunityTypes && (
          <Card.Section divider="flush">
            <Heading size={"md"} priority={3}>
              {t("listings.reservedCommunityTitleDefault")}
            </Heading>
            <p className={styles["bold-subheader"]}>
              {t(`listings.reservedCommunityTypes.${listing.reservedCommunityTypes.name}`)}
            </p>
            {listing.reservedCommunityDescription && (
              <p className={"seeds-m-bs-label"}>{listing.reservedCommunityDescription}</p>
            )}
          </Card.Section>
        )}
      </Card>
    </>
  )
}
