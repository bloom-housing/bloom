import { createContext, useContext } from "react"
import {
  FeatureFlagEnum,
  ListingFeaturesConfiguration,
  MultiselectQuestion,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { FormOption } from "../../../lib/listings/search"

export type ListingsSearchConfig = {
  searchString?: string
  jurisdictionIds?: string[]
  googleMapsApiKey: string
  googleMapsMapId: string
  bedrooms: FormOption[]
  bathrooms: FormOption[]
  jurisdictions: FormOption[]
  activeFeatureFlags?: FeatureFlagEnum[]
  multiselectData: MultiselectQuestion[]
  regions?: string[]
  listingFeaturesConfiguration?: ListingFeaturesConfiguration
}

const ListingsSearchConfigContext = createContext<ListingsSearchConfig | null>(null)

export const useListingsSearchConfigContext = () => {
  const context = useContext(ListingsSearchConfigContext)

  if (!context) {
    throw new Error(
      "useListingsSearchConfigContext must be used inside ListingsSearchConfigContext provider"
    )
  }

  return context
}

export { ListingsSearchConfigContext }
