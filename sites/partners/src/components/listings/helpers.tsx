import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Tag } from "@bloom-housing/ui-seeds"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export const getListingStatusTag = (listingStatus: ListingsStatusEnum) => {
  switch (listingStatus) {
    case ListingsStatusEnum.active:
      return (
        <Tag className="tag-uppercase" variant={"success"} size={"lg"} id={"listing-status-active"}>
          {t(`listings.listingStatus.active`)}
        </Tag>
      )
    case ListingsStatusEnum.closed:
      return (
        <Tag
          className="tag-uppercase"
          variant={"secondary"}
          size={"lg"}
          id={"listing-status-closed"}
        >
          {t(`listings.listingStatus.closed`)}
        </Tag>
      )
    case ListingsStatusEnum.pendingReview:
      return (
        <Tag
          className="tag-uppercase"
          variant={"warn"}
          size={"lg"}
          id={"listing-status-pending-review"}
        >
          {t(`applications.pendingReview`)}
        </Tag>
      )
    case ListingsStatusEnum.changesRequested:
      return (
        <Tag
          className="tag-uppercase"
          variant={"highlight-warm"}
          size={"lg"}
          id={"listing-status-changes-requested"}
        >
          {t(`listings.listingStatus.changesRequested`)}
        </Tag>
      )
    default:
      return (
        <Tag
          className="tag-uppercase"
          variant={"primary"}
          size={"lg"}
          id={"listing-status-pending"}
        >
          {t(`listings.listingStatus.pending`)}
        </Tag>
      )
  }
}
