import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Tag } from "@bloom-housing/ui-seeds"
import { ListingStatus } from "@bloom-housing/backend-core/types"

export const getListingStatusTag = (listingStatus: ListingStatus) => {
  switch (listingStatus) {
    case ListingStatus.active:
      return (
        <Tag variant={"success-inverse"} size={"lg"} id={"listing-status-active"}>
          {t(`listings.listingStatus.active`)}
        </Tag>
      )
    case ListingStatus.closed:
      return (
        <Tag variant={"secondary-inverse"} size={"lg"} id={"listing-status-closed"}>
          {t(`listings.listingStatus.closed`)}
        </Tag>
      )
    case ListingStatus.pendingReview:
      return (
        <Tag variant={"in-process"} size={"lg"} id={"listing-status-pending-review"}>
          {t(`applications.pendingReview`)}
        </Tag>
      )
    case ListingStatus.changesRequested:
      return (
        <Tag variant={"highlight-warm"} size={"lg"} id={"listing-status-changes-requested"}>
          {t(`listings.listingStatus.changesRequested`)}
        </Tag>
      )
    default:
      return (
        <Tag variant={"primary"} size={"lg"} id={"listing-status-pending"}>
          {t(`listings.listingStatus.pending`)}
        </Tag>
      )
  }
}
