import React from "react"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { imageUrlFromListing, oneLineAddress, ClickableCard } from "@bloom-housing/shared-helpers"
import { StackedTable, t } from "@bloom-housing/ui-components"
import { Card, Heading, Link, Tag } from "@bloom-housing/ui-seeds"
import {
  getListingApplicationStatus,
  getListingStackedTableData,
  getListingStatusMessage,
} from "../../lib/helpers"
import { getListingTags } from "../listing/listing_sections/MainDetails"
import styles from "./ListingCard.module.scss"
import FavoriteButton from "../shared/FavoriteButton"

export interface ListingCardProps {
  listing: Listing
  jurisdiction: Jurisdiction
  showFavoriteButton?: boolean
  favorited?: boolean
  setFavorited?: React.Dispatch<React.SetStateAction<boolean>>
}

export const ListingCard = ({
  listing,
  jurisdiction,
  favorited,
  setFavorited,
}: ListingCardProps) => {
  const imageUrl = imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0]
  const listingTags = getListingTags(listing, true)
  const status = getListingApplicationStatus(listing, true, true)
  const actions = []

  // TODO: this needs to be feature flag
  actions.push(
    <FavoriteButton favorited={favorited} setFavorited={setFavorited}>
      Fav!
    </FavoriteButton>
  )

  return (
    <li className={styles["list-item"]}>
      <ClickableCard className={styles["listing-card-container"]}>
        <Card.Section>
          <div className={styles["listing-card-content"]}>
            <div className={styles["details"]}>
              <Link
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
                        {tag.title}
                      </Tag>
                    )
                  })}
                </div>
              )}
              {!!status?.content && (
                <div className={"seeds-m-bs-3"}>
                  {getListingStatusMessage(listing, jurisdiction, null, true)}
                </div>
              )}
              <div className={`${styles["unit-table"]} styled-stacked-table`}>
                <StackedTable
                  headers={{
                    unitType: "t.unitType",
                    minimumIncome: "t.minimumIncome",
                    rent: "t.rent",
                  }}
                  stackedData={getListingStackedTableData(listing.unitsSummarized)}
                />
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
                aria-label={t("listings.buildingImageAltText")}
              />
            </div>
          </div>
        </Card.Section>
      </ClickableCard>
    </li>
  )
}
