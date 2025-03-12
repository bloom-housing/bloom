import * as React from "react"
import { Card, Heading } from "@bloom-housing/ui-seeds"
import {
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
    return `${unitsAvailable} ${
      unitsAvailable === 1 ? t("listings.vacantUnit") : t("listings.vacantUnits")
    }`
  }
  return null
}

export const getAvailabilityContent = (reviewOrderType: ReviewOrderTypeEnum) => {
  switch (reviewOrderType) {
    case ReviewOrderTypeEnum.waitlist:
      return t("listings.waitlist.submitForWaitlist")
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
      return t("listings.waitlist.open")
    default:
      return t("listings.applicationFCFS")
  }
}

export const Availability = ({ listing, jurisdiction }: AvailabilityProps) => {
  const subheading = getAvailabilitySubheading(listing.waitlistOpenSpots, listing.unitsAvailable)
  const content = getAvailabilityContent(listing.reviewOrderType)
  return (
    <>
      {(listing.marketingType === MarketingTypeEnum.comingSoon ||
        listing.status === ListingsStatusEnum.closed) && (
        <div className={"seeds-m-be-content"}>{getListingStatusMessage(listing, jurisdiction)}</div>
      )}
      <Card className={`${listingStyles["mobile-full-width-card"]}`}>
        <Card.Section divider="flush">
          <Heading priority={2} size={"lg"}>
            {t("t.availability")}
          </Heading>
        </Card.Section>

        <Card.Section divider={"flush"}>
          <Heading priority={3} size={"md"}>
            {getAvailabilityHeading(listing.reviewOrderType)}
          </Heading>
          <p className={styles["bold-subheader"]}>
            {listing.reviewOrderType === ReviewOrderTypeEnum.waitlist
              ? t("listings.waitlist.isOpen")
              : t("listings.vacantUnitsAvailable")}
          </p>
          <p className={`${listingStyles["thin-heading-sm"]} seeds-m-bs-label`}>
            {getListingStatusMessageContent(
              listing.status,
              listing.applicationDueDate,
              isFeatureFlagOn(jurisdiction, "enableMarketingStatus"),
              listing.marketingType,
              listing.marketingSeason,
              listing.marketingDate,
              false
            )}
          </p>
          {content && <p className={"seeds-m-bs-label"}>{content}</p>}
          {subheading && <p className={`seeds-m-bs-label`}>{subheading}</p>}
        </Card.Section>
        {listing.reservedCommunityTypes && (
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
