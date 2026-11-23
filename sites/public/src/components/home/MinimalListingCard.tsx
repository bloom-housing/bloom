import React from "react"
import { t } from "@bloom-housing/ui-components"
import {
  ClickableCard,
  IMAGE_FALLBACK_URL,
  imageUrlFromListing,
  oneLineAddress,
} from "@bloom-housing/shared-helpers"
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
  const listingTags = getListingTags(listing, {
    hideReviewTags: true,
    hideHomeTypeTag: !isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableHomeType),
    hideAccessibilityFeaturesTag: isFeatureFlagOn(
      jurisdiction,
      FeatureFlagEnum.disableAccessibilityFeaturesTag
    ),
    enableUnitAccessibilityTypeTags: isFeatureFlagOn(
      jurisdiction,
      FeatureFlagEnum.enableUnitAccessibilityTypeTags
    ),
    enableIsVerified: isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableIsVerified),
    swapCommunityTypeWithPrograms: isFeatureFlagOn(
      jurisdiction,
      FeatureFlagEnum.swapCommunityTypeWithPrograms
    ),
  })

  const imageUrl =
    imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0] || IMAGE_FALLBACK_URL

  return (
    <ClickableCard
      className={styles["minimal-listing-card"]}
      containerClassName={styles["full-height-card"]}
    >
      <div className={styles["image"]}>
        <img
          className={styles["image-background"]}
          src={imageUrl}
          alt={listing.listingImages?.[0]?.description || t("listings.buildingImageAltText")}
          loading="lazy"
          onError={(e) => {
            if (!e.currentTarget.src.endsWith(IMAGE_FALLBACK_URL)) {
              e.currentTarget.src = IMAGE_FALLBACK_URL
            }
          }}
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
