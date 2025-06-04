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

const getWaitlistSizeFields = (
  waitlistCurrentSize?: number,
  waitlistOpenSpots?: number,
  waitlistMaxSize?: number,
  showAdditionalWaitlistFields?: boolean
) => {
  return (
    <div className={styles["waitlist-size-container"]}>
      {waitlistCurrentSize && showAdditionalWaitlistFields && (
        <p>{`${waitlistCurrentSize} ${t("listings.waitlist.currentSize").toLowerCase()}`}</p>
      )}
      {waitlistOpenSpots && (
        <p className={`${showAdditionalWaitlistFields ? styles["bold-text"] : ""}`}>
          {`${waitlistOpenSpots} ${t("listings.waitlist.openSlots").toLowerCase()}`}
        </p>
      )}
      {waitlistMaxSize && showAdditionalWaitlistFields && (
        <p>{`${waitlistMaxSize} ${t("listings.waitlist.finalSize").toLowerCase()}`}</p>
      )}
    </div>
  )
}

export const getAvailabilitySubheading = (
  waitlistOpenSpots: number,
  unitsAvailable: number,
  waitlistCurrentSize?: number,
  waitlistMaxSize?: number,
  showAdditionalWaitlistFields?: boolean
): React.ReactNode => {
  if (waitlistOpenSpots) {
    return getWaitlistSizeFields(
      waitlistCurrentSize,
      waitlistOpenSpots,
      waitlistMaxSize,
      showAdditionalWaitlistFields
    )
  }
  if (unitsAvailable) {
    return (
      <p className={`seeds-m-bs-label`}>
        {`${unitsAvailable} ${unitsAvailable === 1 ? t("t.unit") : t("t.units")}`}
      </p>
    )
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

  const hideAvailabilityDetails =
    listing.status === ListingsStatusEnum.closed ||
    (enableMarketingStatus && listing.marketingType === MarketingTypeEnum.comingSoon)

  const enableUnitGroups = isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableUnitGroups)

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
    enableUnitGroups ? null : listing.waitlistOpenSpots,
    unitsAvailable,
    listing.waitlistCurrentSize,
    listing.waitlistMaxSize,
    showAdditionalWaitlistFields
  )

  const hasWaitlistOpen = enableUnitGroups
    ? listing.unitGroups.some((group) => group.openWaitlist)
    : listing.reviewOrderType === ReviewOrderTypeEnum.waitlist

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
          {subheading}
        </Card.Section>
        {enableUnitGroups && (
          <Card.Section divider="flush">
            <Heading size={"md"} priority={3}>
              {t("listings.waitlist.open")}
            </Heading>
            <p className={styles["bold-subheader"]}>
              {hasWaitlistOpen ? t("listings.waitlist.isOpen") : t("listings.waitlist.isClosed")}
            </p>
            {hasWaitlistOpen && (
              <p className={`${listingStyles["thin-heading-sm"]} seeds-m-bs-label`}>
                {t("listings.waitlist.submitForWaitlist")}
              </p>
            )}
            {getWaitlistSizeFields(
              listing.waitlistCurrentSize,
              listing.waitlistOpenSpots,
              listing.waitlistMaxSize,
              showAdditionalWaitlistFields
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
