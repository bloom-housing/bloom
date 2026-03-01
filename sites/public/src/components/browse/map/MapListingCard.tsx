import React, { useMemo } from "react"
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
  jurisdiction: Jurisdiction
  showHomeType?: boolean
}

export const MapListingCard = ({ listing, jurisdiction, showHomeType }: MapListingCardProps) => {
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

  const unitsPreviewTable = useMemo(() => {
    const hasData = listing.unitGroups.length || listing.units.length

    if (!hasData) {
      return
    }

    if (enableUnitGroups && listing.unitGroups?.length > 0) {
      return (
        <StackedTable
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
          headers={{
            unitType: "t.unitType",
            minimumIncome: "t.minimumIncome",
            rent: "t.rent",
          }}
          stackedData={getListingStackedTableData(listing.unitsSummarized)}
        />
      )
    }
  }, [
    listing.units,
    listing.unitGroups,
    listing.marketingType,
    listing.listingType,
    listing.unitGroupsSummarized,
    listing.unitsSummarized,
    enableUnitGroups,
  ])

  return (
    <li className={styles["list-item"]}>
      <ClickableCard className={styles["listing-card-container"]}>
        <Card.Section>
          <div className={styles["listing-card-content"]}>
            <div className={styles["details"]}>
              <Link
                id="listing-seeds-link"
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
              {/* {!!status?.content && (
                <div className={"seeds-m-bs-3"}>
                  {getListingStatusMessage(listing, jurisdiction, null, true)}
                </div>
              )} */}
              <div className={`${styles["unit-table"]} styled-stacked-table`}>
                {unitsPreviewTable}
              </div>
              {actions.length > 0 && (
                <div className={styles["action-container"]}>{actions.map((action) => action)}</div>
              )}
            </div>
            <div className={styles["image"]}>
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
