declare global {
  interface Window {
    dataLayer: DataLayerArgsUnion[]
  }
}

export type BaseDataLayerArgs = {
  event: string
  pageTitle: string
  userId: string
}

export type ListingList = BaseDataLayerArgs & {
  numberOfListings?: string
  listingIDs?: string[]
}

export type ListingDetail = BaseDataLayerArgs & {
  listingStartDate?: string
  listingStatus?: string
  listingID?: string
  applicationDueDate?: string
  paperApplication?: string
}

type DataLayerArgsUnion = BaseDataLayerArgs | BaseDataLayerArgs | BaseDataLayerArgs

export function pushGtmEvent<T extends DataLayerArgsUnion>(args: T): void {
  if (!window) return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(args)
}
