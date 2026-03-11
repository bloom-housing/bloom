import React from "react"
import { useRouter } from "next/router"
import { APIProvider } from "@vis.gl/react-google-maps"
import { Heading } from "@bloom-housing/ui-seeds"
import {
  Jurisdiction,
  Listing,
  MultiselectQuestion,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import Layout from "../../../layouts/application"
import ListingsSearchCombined from "./ListingsSearchCombined"
import { ListingsSearchConfigContext } from "./ListingsSearchConfigContext"

export interface PaginationData {
  currentPage: number
  itemCount: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export interface ListingBrowseProps {
  listings: Listing[]
  jurisdiction: Jurisdiction
  multiselectData: MultiselectQuestion[]
  paginationData?: PaginationData
  areFiltersActive?: boolean
}

export const ListingMap = (props: ListingBrowseProps) => {
  const router = useRouter()

  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`

  // Map TODO: Dynamic jurisdictions
  let searchString = `jurisdictions:${props.jurisdiction.name}`
  const searchParam = Array.isArray(router.query.search)
    ? router.query.search[0]
    : router.query.search

  if (searchParam) {
    searchString = searchParam
  }

  const listingsSearchConfig = {
    googleMapsApiKey: process.env.googleMapsApiKey,
    googleMapsMapId: process.env.googleMapsMapId,
    searchString,
    jurisdictionIds: props.jurisdiction?.id ? [props.jurisdiction.id] : [],
    bedrooms: [],
    bathrooms: [],
    activeFeatureFlags: props.jurisdiction?.featureFlags
      ?.filter((featureFlag) => featureFlag.active)
      ?.map((entry) => entry.name),
    multiselectData: props.multiselectData,
    regions: props.jurisdiction?.regions,
    listingFeaturesConfiguration: props.jurisdiction?.listingFeaturesConfiguration,
    // Map TODO: Dynamic jurisdictions
    jurisdictions: [{ label: props.jurisdiction.name, value: props.jurisdiction.id }],
  }

  return (
    <Layout hideFooter={true} pageTitle={pageTitle}>
      <Heading className={"sr-only"} priority={1}>
        {t("nav.listings")}
      </Heading>
      <APIProvider apiKey={process.env.googleMapsApiKey}>
        <ListingsSearchConfigContext.Provider value={listingsSearchConfig}>
          <ListingsSearchCombined />
        </ListingsSearchConfigContext.Provider>
      </APIProvider>
    </Layout>
  )
}
