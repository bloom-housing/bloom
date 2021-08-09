export enum ListingViewEnum {
  base = "base",
}

export interface View {
  select: string[]
  leftJoins: {
    join: string
    alias: string
  }[]
}

export type Views = {
  [key in ListingViewEnum]: View
}
