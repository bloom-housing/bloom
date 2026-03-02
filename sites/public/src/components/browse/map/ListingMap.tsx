import React, { useEffect, useContext } from "react"
import { useRouter } from "next/router"
import { APIProvider } from "@vis.gl/react-google-maps"
import { Heading } from "@bloom-housing/ui-seeds"
import {
  Jurisdiction,
  Listing,
  MultiselectQuestion,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext, ListingList, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import Layout from "../../../layouts/application"
import { UserStatus } from "../../../lib/constants"
import ListingsSearchCombined from "./ListingsSearchCombined"

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
  const { profile, userService } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<ListingList>({
      event: "pageView",
      pageTitle: "Rent Affordable Housing - Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
      numberOfListings: props.listings?.length,
      listingIds: props.listings?.map((listing) => listing.id),
    })
  }, [profile, props.listings, userService])

  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`

  // Map TODO: Dynamic jurisdictions
  let searchString = `jurisdictions:${props.jurisdiction.name}`
  const searchParam = Array.isArray(router.query.search)
    ? router.query.search[0]
    : router.query.search

  // override the search value if present in url
  if (searchParam) {
    searchString = searchParam
  }

  return (
    <Layout hideFooter={true} pageTitle={pageTitle}>
      <Heading className={"sr-only"} priority={1}>
        {t("nav.listings")}
      </Heading>
      <APIProvider apiKey={process.env.googleMapsApiKey}>
        <ListingsSearchCombined
          googleMapsApiKey={process.env.googleMapsApiKey}
          googleMapsMapId={process.env.googleMapsMapId}
          searchString={searchString}
          jurisdictionIds={props.jurisdiction?.id ? [props.jurisdiction.id] : []}
          bedrooms={[]}
          bathrooms={[]}
          activeFeatureFlags={props.jurisdiction?.featureFlags
            ?.filter((featureFlag) => featureFlag.active)
            ?.map((entry) => entry.name)}
          multiselectData={props.multiselectData}
          regions={props.jurisdiction?.regions}
          listingFeaturesConfiguration={props.jurisdiction?.listingFeaturesConfiguration}
          // Map TODO: Dynamic jurisdictions
          jurisdictions={[{ label: props.jurisdiction.name, value: props.jurisdiction.id }]}
        />
      </APIProvider>
    </Layout>
  )
}
