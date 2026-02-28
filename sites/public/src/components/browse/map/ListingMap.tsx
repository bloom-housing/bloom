import React, { useEffect, useContext, useState, useCallback } from "react"
import { useRouter } from "next/router"
import { APIProvider } from "@vis.gl/react-google-maps"
import { Button, Card, Heading, LoadingState } from "@bloom-housing/ui-seeds"
import {
  Jurisdiction,
  Listing,
  FeatureFlagEnum,
  MultiselectQuestion,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  AuthContext,
  BloomCard,
  ListingList,
  MessageContext,
  pushGtmEvent,
  ResponseException,
} from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import Layout from "../../../layouts/application"
import MaxWidthLayout from "../../../layouts/max-width"
import { UserStatus } from "../../../lib/constants"
import { fetchFavoriteListingIds, isFeatureFlagOn, saveListingFavorite } from "../../../lib/helpers"
import { FilterDrawer } from "../FilterDrawer"
import {
  decodeQueryToFilterData,
  encodeFilterDataToQuery,
  FilterData,
  getFilterQueryFromURL,
} from "../FilterDrawerHelpers"
import { PageHeaderSection } from "../../../patterns/PageHeaderLayout"
import { ListingCard } from "../ListingCard"
import styles from "../ListingBrowse.module.scss"
import { MetaTags } from "../../shared/MetaTags"
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
  const { addToast } = useContext(MessageContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

  let searchString =
    "counties:Alameda,Contra Costa,Marin,Napa,San Francisco,San Mateo,Santa Clara,Solano,Sonoma"
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
          bedrooms={[]}
          bathrooms={[]}
          counties={[]}
        />
      </APIProvider>
    </Layout>
  )
}
