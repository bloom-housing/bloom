import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Tag } from "@bloom-housing/ui-seeds"
import { ListingStatus } from "@bloom-housing/backend-core/types"

export const getListingStatusTag = (listingStatus: ListingStatus) => {
  switch (listingStatus) {
    case ListingStatus.active:
      return (
        <Tag variant={"success-inverse"} size={"lg"}>
          {t(`listings.listingStatus.active`)}
        </Tag>
      )
    case ListingStatus.closed:
      return (
        <Tag variant={"secondary-inverse"} size={"lg"}>
          {t(`listings.listingStatus.closed`)}
        </Tag>
      )
    case ListingStatus.pendingReview:
      return (
        <Tag variant={"in-process"} size={"lg"}>
          {t(`applications.pendingReview`)}
        </Tag>
      )
    case ListingStatus.changesRequested:
      return (
        <Tag variant={"highlight-warm"} size={"lg"}>
          {t(`listings.listingStatus.changesRequested`)}
        </Tag>
      )
    default:
      return (
        <Tag variant={"primary"} size={"lg"}>
          {t(`listings.listingStatus.pending`)}
        </Tag>
      )
  }
}
