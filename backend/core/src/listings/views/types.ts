import { View } from "../../views/base.view"

export enum ListingViewEnum {
  base = "base",
  detail = "detail",
  full = "full",
  partnerList = "partnerList",
  publicListings = "publicListings",
}

export type Views = {
  [key in ListingViewEnum]?: View
}
