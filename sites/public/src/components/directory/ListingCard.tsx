import React from "react"
import InfoIcon from "@heroicons/react/24/solid/InformationCircleIcon"
import {
  Listing,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import styles from "./ListingCard.module.scss"
import { imageUrlFromListing, oneLineAddress } from "@bloom-housing/shared-helpers"
import { StackedTable, t } from "@bloom-housing/ui-components"
import { Card, Heading, Icon, Link, Message, Tag } from "@bloom-housing/ui-seeds"
import { getListingTags } from "../listing/listing_sections/MainDetails"
import { getListingApplicationStatusSeeds, getListingStackedTableData } from "../../lib/helpers"

export interface ListingCardProps {
  listing: Listing
}

export const getMessageData = (reviewOrder: ReviewOrderTypeEnum): string => {
  switch (reviewOrder) {
    case ReviewOrderTypeEnum.lottery:
      return t("listings.lottery")
    case ReviewOrderTypeEnum.firstComeFirstServe:
      return t("listings.applicationFCFS")
    case ReviewOrderTypeEnum.waitlist:
      return t("listings.waitlist.open")
    default:
      return ""
  }
}

export const ListingCard = ({ listing }: ListingCardProps) => {
  const imageUrl = imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0]
  const listingTags = getListingTags(listing, true)
  const status = getListingApplicationStatusSeeds(listing, true)
  // TODO: Add favorites if toggled on
  const actions = [
    // <Button
    //   onClick={() => alert("hi")}
    //   size={"sm"}
    //   variant={"primary-outlined"}
    //   className={`${styles["action-button"]}}`}
    //   ariaLabel={`Favorite ${listing.name}`}
    //   key={"Favorite"}
    // >
    //   Favorite
    // </Button>,
  ]

  return (
    <li className={styles["list-item"]}>
      <Card className={styles["listing-card-container"]}>
        <Card.Section>
          <div className={styles["listing-card"]}>
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
              {!!status.content && (
                <Message
                  className={`${styles["due-date"]}`}
                  customIcon={
                    <Icon size="md" className={styles["primary-color-icon"]}>
                      <InfoIcon />
                    </Icon>
                  }
                  variant={"primary"}
                >
                  <div className={styles["due-date-content"]}>
                    <div className={styles["date-review-order"]}>
                      {getMessageData(listing.reviewOrderType)}
                    </div>
                    <div>{status.content}</div>
                  </div>
                </Message>
              )}
              <div className={styles["unit-table"]}>
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
      </Card>
    </li>
  )
}
