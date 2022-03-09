import * as React from "react"
import { t } from "@bloom-housing/ui-components"
import { Listing } from "@bloom-housing/backend-core/types"

export const occupancyTable = (listing: Listing) => {
  return [] as any
}

export const getOccupancyDescription = (listing: Listing) => {
  return t("listings.occupancyDescriptionNoSro")
}
