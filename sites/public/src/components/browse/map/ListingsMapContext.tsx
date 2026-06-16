import React, { createContext, useContext } from "react"
import type {
  FeatureFlagEnum,
  IdDTO,
  Listing,
  ListingFeaturesConfiguration,
  ListingMapMarker,
  MultiselectQuestion,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import type { FormOption, ListingSearchParams } from "../../../lib/listings/search"
import type { MapMarkerData } from "./ListingsMap"

export type ListingsSearchResults = {
  listings: Listing[]
  markers: ListingMapMarker[]
  currentPage: number
  lastPage: number
  totalItems: number
}

export type ListingsMapContextValue = {
  searchString?: string
  jurisdictionIds?: string[]
  googleMapsApiKey?: string
  googleMapsMapId?: string
  bedrooms: FormOption[]
  bathrooms: FormOption[]
  jurisdictions: IdDTO[]
  activeFeatureFlags?: FeatureFlagEnum[]
  multiselectData: MultiselectQuestion[]
  regions?: string[]
  listingFeaturesConfiguration?: ListingFeaturesConfiguration
  searchFilter: ListingSearchParams
  searchResults: ListingsSearchResults
  listView: boolean
  setListView: React.Dispatch<React.SetStateAction<boolean>>
  isDesktop: boolean
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  visibleMarkers: MapMarkerData[]
  setVisibleMarkers: React.Dispatch<React.SetStateAction<MapMarkerData[]>>
  isFirstBoundsLoad: boolean
  setIsFirstBoundsLoad: React.Dispatch<React.SetStateAction<boolean>>
  setFilterDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  filterCount: number
  onPageChange: (page: number) => void
  infoWindowIndex: number | null
  setInfoWindowIndex: React.Dispatch<React.SetStateAction<number | null>>
  notificationsSignUpUrl?: string
}

export const ListingsMapContext = createContext<ListingsMapContextValue | null>(null)

export const useListingsMapContext = () => {
  const context = useContext(ListingsMapContext)

  if (!context) {
    throw new Error("useListingsMapContext must be used inside ListingsMapContext provider")
  }

  return context
}
