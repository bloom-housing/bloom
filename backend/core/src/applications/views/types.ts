import { View } from "../../views/base.view"

export enum ApplicationViewEnum {
  base = "base",
  partnerList = "partnerList",
}

export type Views = {
  [key in ApplicationViewEnum]?: View
}
