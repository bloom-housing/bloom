import React from "react"
import InfoIcon from "@heroicons/react/24/solid/InformationCircleIcon"
import {
  Listing,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { imageUrlFromListing, oneLineAddress, ClickableCard } from "@bloom-housing/shared-helpers"
import { StackedTable, t } from "@bloom-housing/ui-components"
import { Card, Heading, Icon, Link, Message, Tag } from "@bloom-housing/ui-seeds"
import { getListingApplicationStatus, getListingStackedTableData } from "../../lib/helpers"
import { getListingTags } from "../listing/listing_sections/MainDetails"
import styles from "./ListingCard.module.scss"

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
  const status = getListingApplicationStatus(listing, true, true)
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
                    <span>
                      {listing.status === ListingsStatusEnum.active && (
                        <span className={styles["date-review-order"]}>
                          {getMessageData(listing.reviewOrderType)}
                          {`: `}
                        </span>
                      )}
                      {status.content}
                    </span>
                  </div>
                </Message>
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
