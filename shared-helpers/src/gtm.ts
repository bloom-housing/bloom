declare global {
  interface Window {
    dataLayer: DataLayerArgsUnion[]
  }
}

export type PageView = {
  event: string
  pageTitle: string
  status: string
}

export type ListingList = PageView & {
  numberOfListings: string
  listingIds: string[]
}

export type ListingDetail = PageView & {
  listingStartDate: string
  listingStatus: string
  listingID: string
  applicationDueDate: string
  paperApplication: boolean
}

type DataLayerArgsUnion = PageView | ListingList | ListingDetail

export function pushGtmEvent<T extends DataLayerArgsUnion>(args: T): void {
  if (!window) return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(args)
}
