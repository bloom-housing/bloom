import React, { useLayoutEffect, useRef } from "react"
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

  const unitsPreviewTable = (() => {
    const hasData = listing.unitGroups?.length || listing.units?.length

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
      data-testid={`listing-card-component`}
    >
      <ClickableCard
        className={styles["listing-card-container"]}
        containerClassName={styles["listing-card-outer-container"]}
      >
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
                {/* TODO: make the county display conditional on if the county filter is enabled */}
                {oneLineAddress(listing.listingsBuildingAddress, true)}
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

const DESKTOP_MIN_WIDTH = 768

export const MapListingCardList = ({ children }: { children: React.ReactNode }) => {
  const listRef = useRef<HTMLUListElement>(null)

  useLayoutEffect(() => {
    const equalize = () => {
      const ul = listRef.current
      if (!ul) return

      const items = Array.from(ul.querySelectorAll<HTMLLIElement>(":scope > li"))
      items.forEach((li) => (li.style.minHeight = ""))

      if (items.length <= 1 || window.innerWidth < DESKTOP_MIN_WIDTH) return

      const max = Math.max(...items.map((li) => li.getBoundingClientRect().height))
      if (isFinite(max) && max > 0) {
        items.forEach((li) => (li.style.minHeight = `${max}px`))
      }
    }

    equalize()
    window.addEventListener("resize", equalize)
    return () => window.removeEventListener("resize", equalize)
  })

  return <ul ref={listRef}>{children}</ul>
}
