import React from "react"
import Head from "next/head"
import { APIProvider } from "@vis.gl/react-google-maps"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Heading } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { MetaTags } from "../components/shared/MetaTags"
import ListingsSearchCombined, {
  locations,
} from "../components/listings/search/ListingsSearchCombined"
import ListingsSearchCombinedDeprecated from "../components/listings/search/ListingsSearchCombinedDeprecated"
import { FormOption } from "../components/listings/search/ListingsSearchModal"
import { runtimeConfig } from "../lib/runtime-config"
import Layout from "../layouts/application"
export interface ListingsProps {
  openListings: Listing[]
  closedListings: Listing[]
  paginationData: {
    currentPage: number
    itemCount: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
  jurisdiction: Jurisdiction
}
export interface DoorwayListingsProps {
  listingsEndpoint: string
  googleMapsApiKey: string
  googleMapsMapId: string
  showAllMapPins: string
  bedrooms: FormOption[]
  bathrooms: FormOption[]
}

export default function ListingsPage(props: DoorwayListingsProps) {
  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome")
  const metaImage = "" // TODO: replace with hero image
  let searchString =
    "counties:Alameda,Contra Costa,Marin,Napa,San Francisco,San Mateo,Santa Clara,Solano,Sonoma"
  const url = new URL(document?.location.toString())
  const searchParam = url.searchParams.get("search")

  // override the search value if present in url
  if (searchParam) {
    searchString = searchParam
  }
  return (
    <Layout hideFooter={true}>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <Heading className={"sr-only"} priority={1}>
        {t("nav.listings")}
      </Heading>
      {props.showAllMapPins === "TRUE" ? (
        <APIProvider apiKey={props.googleMapsApiKey}>
          <ListingsSearchCombined
            googleMapsApiKey={props.googleMapsApiKey}
            googleMapsMapId={props.googleMapsMapId}
            searchString={searchString}
            bedrooms={props.bedrooms}
            bathrooms={props.bathrooms}
            counties={locations}
          />
        </APIProvider>
      ) : (
        <ListingsSearchCombinedDeprecated
          googleMapsApiKey={props.googleMapsApiKey}
          searchString={searchString}
          bedrooms={props.bedrooms}
          bathrooms={props.bathrooms}
          counties={locations}
        />
      )}
    </Layout>
  )
}

export function getServerSideProps() {
  return {
    props: {
      googleMapsApiKey: runtimeConfig.getGoogleMapsApiKey() || null,
      googleMapsMapId: runtimeConfig.getGoogleMapsMapId() || null,
      showAllMapPins: runtimeConfig.getShowAllMapPins() || null,
    },
  }
}
