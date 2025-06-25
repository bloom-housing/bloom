import React from "react"
import { t } from "@bloom-housing/ui-components"
import { ClickableCard, imageUrlFromListing, oneLineAddress } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  Jurisdiction,
  Listing,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Icon, Link, Tag } from "@bloom-housing/ui-seeds"
import { getListingStatusMessage, isFeatureFlagOn } from "../../lib/helpers"
import { getListingTags } from "../listing/listing_sections/MainDetails"
import styles from "./MinimalListingCard.module.scss"

interface MinimalListingCardProps {
  jurisdiction: Jurisdiction
  listing: Listing
}

export const MinimalListingCard = ({ listing, jurisdiction }: MinimalListingCardProps) => {
  const listingTags = getListingTags(
    listing,
    true,
    !isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableHomeType),
    !isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableAccessibilityFeatures),
    isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableIsVerified),
    isFeatureFlagOn(jurisdiction, FeatureFlagEnum.swapCommunityTypeWithPrograms)
  )

  return (
    <ClickableCard
      className={styles["minimal-listing-card"]}
      containerClassName={styles["full-height-card"]}
    >
      <div className={styles["image"]}>
        <div
          className={styles["image-background"]}
          style={{
            backgroundImage: `url(${
              imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0]
            })`,
          }}
          role="img"
          aria-label={t("listings.buildingImageAltText")}
        />
      </div>
      <div className={styles["card-content"]}>
        <div className={styles["listing-info"]}>
          <Link
            href={`/listing/${listing.id}/${listing.urlSlug}`}
            className={styles["listing-name"]}
          >
            {listing.name}
          </Link>
          <div className={"seeds-m-bs-2"}>{oneLineAddress(listing.listingsBuildingAddress)}</div>
          {listingTags.length > 0 && (
            <div className={`${styles["tags"]} seeds-m-bs-2`}>
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
        </div>
        <div className={`${styles["listing-status"]} seeds-m-bs-3`}>
          {getListingStatusMessage(listing, jurisdiction, null, true, true)}
        </div>
      </div>
    </ClickableCard>
  )
}
