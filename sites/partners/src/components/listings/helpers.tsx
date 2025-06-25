import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Tag } from "@bloom-housing/ui-seeds"
import { ListingsStatusEnum, MinMax } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

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

export function minMaxFinder(range: MinMax, value: number): MinMax {
  if (range === undefined) {
    return {
      min: value,
      max: value,
    }
  } else {
    range.min = Math.min(range.min, value)
    range.max = Math.max(range.max, value)

    return range
  }
}

export const formatRange = (
  min: string | number,
  max: string | number,
  prefix = "",
  postfix = ""
): string => {
  if (!min && !max) return ""
  if (min == max || !max) return `${prefix}${min}${postfix}`
  if (!min) return `${prefix}${max}${postfix}`
  return `${prefix}${min}${postfix} - ${prefix}${max}${postfix}`
}

export function formatRentRange(rent: MinMax, percent: MinMax): string {
  let toReturn = ""
  if (rent) {
    toReturn += formatRange(rent.min, rent.max)
  }
  if (rent && percent) {
    toReturn += ", "
  }
  if (percent) {
    toReturn += formatRange(percent.min, percent.max, "", "%")
  }
  return toReturn
}
