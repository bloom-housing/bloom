import * as React from "react"
import { Card, Heading } from "@bloom-housing/ui-seeds"
import {
  Jurisdiction,
  Listing,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import { getReservedTitle } from "../ListingViewSeedsHelpers"
import listingStyles from "../ListingViewSeeds.module.scss"
import { getListingStatusMessageContent, isFeatureFlagOn } from "../../../lib/helpers"
import { jurisdiction } from "../../../../../../shared-helpers/__tests__/testHelpers"

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

export const Availability = ({ listing }: AvailabilityProps) => {
  if (listing.status === ListingsStatusEnum.closed && !listing.reservedCommunityTypes) return
  const subheading = getAvailabilitySubheading(listing.waitlistOpenSpots, listing.unitsAvailable)
  const content = getAvailabilityContent(listing.reviewOrderType)
  return (
    <Card className={`${listingStyles["mobile-full-width-card"]}`}>
      <Card.Section divider="flush">
        <Heading priority={2} size={"lg"}>
          {t("t.availability")}
        </Heading>
      </Card.Section>
      {listing.status !== ListingsStatusEnum.closed && (
        <Card.Section divider={"flush"}>
          <Heading priority={3} size={"md"}>
            {listing.status === ListingsStatusEnum.active
              ? listing.reviewOrderType === ReviewOrderTypeEnum.waitlist
                ? t("listings.waitlist.isOpen")
                : t("listings.vacantUnitsAvailable")
              : t("account.closedApplications")}
          </Heading>
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
      )}
      {listing.reservedCommunityTypes && (
        <Card.Section divider="flush">
          <Heading size={"md"} priority={3}>
            {getReservedTitle(listing.reservedCommunityTypes)}
          </Heading>
          <p className={`${listingStyles["thin-heading-sm"]} seeds-m-bs-label`}>
            {t(`listings.reservedCommunityTypes.${listing.reservedCommunityTypes.name}`)}
          </p>
          {listing.reservedCommunityDescription && (
            <p className={"seeds-m-bs-label"}>{listing.reservedCommunityDescription}</p>
          )}
        </Card.Section>
      )}
    </Card>
  )
}
