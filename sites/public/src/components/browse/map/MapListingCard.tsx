import React from "react"
import {
  EnumListingListingType,
  FeatureFlagEnum,
  Jurisdiction,
  Listing,
  MarketingTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { imageUrlFromListing, oneLineAddress, ClickableCard } from "@bloom-housing/shared-helpers"
import { StackedTable, t } from "@bloom-housing/ui-components"
import { Card, Heading, Link, Tag, Icon } from "@bloom-housing/ui-seeds"
import {
  getListingStackedGroupTableData,
  getListingStackedTableData,
  isFeatureFlagOn,
} from "../../../lib/helpers"
import { getListingTags } from "../../listing/listing_sections/MainDetails"
import styles from "./MapListingCard.module.scss"

export interface MapListingCardProps {
  listing: Listing
  index: number
  jurisdiction: Jurisdiction
  showHomeType?: boolean
  forceMobileView?: boolean
  onClose?: () => void
}

export const MapListingCard = ({
  listing,
  jurisdiction,
  showHomeType,
  index,
  forceMobileView,
  onClose,
}: MapListingCardProps) => {
  const enableUnitGroups = isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableUnitGroups)

  const imageUrl = imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0]
  const listingTags = getListingTags(
    listing,
    true,
    !showHomeType,
    !isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableAccessibilityFeatures),
    isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableIsVerified),
    isFeatureFlagOn(jurisdiction, FeatureFlagEnum.swapCommunityTypeWithPrograms)
  )
  const actions = []

  const unitsPreviewTable = (() => {
    const hasData = listing.unitGroups.length || listing.units.length

    if (!hasData) {
      return
    }

    if (enableUnitGroups && listing.unitGroups?.length > 0) {
      return (
        <StackedTable
          className={forceMobileView ? "force-mobile-responsive" : undefined}
          headers={{
            unitType: "t.unitType",
            rent: "t.rent",
            availability: "t.availability",
          }}
          stackedData={getListingStackedGroupTableData(
            listing.unitGroupsSummarized,
            listing.marketingType === MarketingTypeEnum.comingSoon,
            listing.listingType === EnumListingListingType.nonRegulated
          )}
        />
      )
    } else {
      return (
        <StackedTable
          className={forceMobileView ? "force-mobile-responsive" : undefined}
          headers={{
            unitType: "t.unitType",
            rent: "t.rent",
          }}
          stackedData={getListingStackedTableData(listing.unitsSummarized)}
        />
      )
    }
  })()

  return (
    <li
      className={`${styles["list-item"]} ${forceMobileView ? styles["force-mobile-view"] : ""}`}
      key={index}
    >
      <ClickableCard className={styles["listing-card-container"]}>
        <Card.Section>
          <div className={styles["listing-card-content"]}>
            <div className={styles["details"]}>
              <Link
                id={`listing-seeds-link-${listing.id}`}
                className={styles["main-link"]}
                href={`/listing/${listing.id}/${listing.urlSlug}`}
              >
                <Heading priority={2} size={"xl"} className={styles["name"]}>
                  {listing.name}
                </Heading>
              </Link>

              <div className={styles["address"]}>
                {oneLineAddress(listing.listingsBuildingAddress)}
              </div>
              {listingTags.length > 0 && (
                <div className={`${styles["tags"]}`}>
                  {listingTags.map((tag, index) => {
                    return (
                      <Tag variant={tag.variant} key={index} className={styles["tag"]}>
                        <span>
                          {tag.icon && <Icon>{tag.icon}</Icon>}
                          {tag.title}
                        </span>
                      </Tag>
                    )
                  })}
                </div>
              )}
              <div className={`${styles["unit-table"]} styled-stacked-table`}>
                {unitsPreviewTable}
              </div>
              {actions.length > 0 && (
                <div className={styles["action-container"]}>{actions.map((action) => action)}</div>
              )}
            </div>
            <div className={styles["image"]}>
              {forceMobileView && onClose && (
                <button
                  type="button"
                  className={styles["close-button"]}
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    onClose()
                  }}
                  aria-label={t("t.close")}
                >
                  ×
                </button>
              )}
              <div
                className={styles["image-background"]}
                style={{ backgroundImage: `url(${imageUrl})` }}
                role="img"
                aria-label={
                  listing.listingImages?.[0]?.description || t("listings.buildingImageAltText")
                }
              />
            </div>
          </div>
        </Card.Section>
      </ClickableCard>
    </li>
  )
}
