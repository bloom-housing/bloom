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
  if (
    waitlistOpenSpots == undefined &&
    waitlistCurrentSize == undefined &&
    waitlistMaxSize == undefined
  )
    return null
  return (
    <div className={styles["waitlist-size-container"]}>
      {waitlistCurrentSize !== undefined && showAdditionalWaitlistFields && (
        <p>{`${waitlistCurrentSize} ${t("listings.waitlist.currentSize").toLowerCase()}`}</p>
      )}
      {waitlistOpenSpots !== undefined && (
        <p className={`${showAdditionalWaitlistFields ? styles["bold-text"] : ""}`}>
          {`${waitlistOpenSpots} ${t("listings.waitlist.openSlots").toLowerCase()}`}
        </p>
      )}
      {waitlistMaxSize !== undefined && showAdditionalWaitlistFields && (
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
  showAdditionalWaitlistFields?: boolean,
  isWaitlistOpen?: boolean,
  enableUnitGroups?: boolean
): React.ReactNode => {
  if (
    isWaitlistOpen &&
    !enableUnitGroups &&
    (waitlistOpenSpots !== undefined ||
      waitlistCurrentSize !== undefined ||
      waitlistMaxSize !== undefined)
  ) {
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
    listing.marketingYear,
    false
  )
  const unitsAvailable =
    listing.unitGroups.length > 0
      ? listing.unitGroups.reduce((acc, curr) => acc + curr.totalAvailable, 0)
      : listing.unitsAvailable

  const subheading = getAvailabilitySubheading(
    listing.waitlistOpenSpots,
    unitsAvailable,
    listing.waitlistCurrentSize,
    listing.waitlistMaxSize,
    showAdditionalWaitlistFields,
    listing.isWaitlistOpen,
    enableUnitGroups
  )

  const hasUnitGroupsWaitlistOpen = listing.unitGroups.some((group) => group.openWaitlist)

  const getCardSection = (
    title: string,
    subtitle?: string,
    content?: string,
    subheading?: React.ReactNode,
    additionalContent?: React.ReactNode
  ) => {
    return (
      <Card.Section divider={"flush"} key={title}>
        <Heading priority={3} size={"md"}>
          {title}
        </Heading>
        {!hideAvailabilityDetails && subtitle && (
          <p className={styles["bold-subheader"]}>{subtitle}</p>
        )}
        {statusMessage && (
          <p className={`${listingStyles["thin-heading-sm"]} seeds-m-bs-label`}>{statusMessage}</p>
        )}
        {content && <p className={"seeds-m-bs-label"}>{content}</p>}
        {subheading && subheading}
        {additionalContent && additionalContent}
      </Card.Section>
    )
  }

  const constructionContent = getCardSection(
    t("listings.underConstruction"),
    null,
    !enableUnitGroups ? getAvailabilityContent(listing.reviewOrderType, listing.status) : null,
    subheading
  )

  const fcfsContent = getCardSection(
    t("listings.applicationFCFS"),
    t("listings.vacantUnitsAvailable"),
    t("listings.eligibleApplicants.FCFS"),
    subheading
  )

  const waitlistContent = getCardSection(
    t("listings.waitlist.label"),
    t("listings.waitlist.isOpen"),
    listing.status !== ListingsStatusEnum.closed ? t("listings.waitlist.submitForWaitlist") : null,
    !enableUnitGroups ? subheading : null,
    enableUnitGroups
      ? getWaitlistSizeFields(
          listing.waitlistCurrentSize,
          listing.waitlistOpenSpots,
          listing.waitlistMaxSize,
          showAdditionalWaitlistFields
        )
      : null
  )

  const lotteryContent = getCardSection(
    t("listings.lottery"),
    t("listings.vacantUnitsAvailable"),
    t("listings.availableUnitsDescription"),
    subheading
  )

  const getSections = () => {
    if (enableMarketingStatus && listing.marketingType === MarketingTypeEnum.comingSoon)
      return [constructionContent]
    if (!enableUnitGroups) {
      switch (listing.reviewOrderType) {
        case ReviewOrderTypeEnum.lottery:
          return [lotteryContent]
        case ReviewOrderTypeEnum.waitlist:
          return [waitlistContent]
        default:
          return [fcfsContent]
      }
    } else {
      const sections = []
      if (unitsAvailable && listing.reviewOrderType === ReviewOrderTypeEnum.firstComeFirstServe)
        sections.push(fcfsContent)
      if (listing.reviewOrderType === ReviewOrderTypeEnum.lottery) sections.push(lotteryContent)
      if (hasUnitGroupsWaitlistOpen) sections.push(waitlistContent)
      return sections
    }
  }

  const sections = getSections()

  // Only show this section when unit groups is on if the listing is under construction
  if (
    enableUnitGroups &&
    enableMarketingStatus &&
    listing.marketingType === MarketingTypeEnum.marketing
  )
    return null

  return (
    <>
      {hideAvailabilityDetails && (
        <div className={styles["status-messages"]}>
          <div className={"seeds-m-be-content"}>
            {getListingStatusMessage(listing, jurisdiction, null, false, true)}
          </div>
        </div>
      )}
      {sections?.length ? (
        <Card className={`${listingStyles["mobile-full-width-card"]}`}>
          <Card.Section divider="flush">
            <Heading priority={2} size={"lg"}>
              {t("t.availability")}
            </Heading>
          </Card.Section>
          {sections?.map((section) => {
            return section
          })}
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
      ) : null}
    </>
  )
}
