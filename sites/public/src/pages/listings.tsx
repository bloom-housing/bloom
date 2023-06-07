import React from "react"
import Head from "next/head"
import { t } from "@bloom-housing/ui-components"
import LayoutWithoutFooter from "../layouts/LayoutWithoutFooter"
import { MetaTags } from "../components/shared/MetaTags"
import ListingsSearchCombined, {
  locations,
  bedroomOptions,
  bathroomOptions,
} from "../components/listings/search/ListingsSearchCombined"
import { FormOption } from "../components/listings/search/ListingsSearchModal"
import { runtimeConfig } from "../lib/runtime-config"
import { getListingServiceUrl } from "../lib/helpers"

export interface ListingsProps {
  listingsEndpoint: string
  googleMapsApiKey: string
  initialSearch?: string
  bedrooms: FormOption[]
  bathrooms: FormOption[]
  locations: FormOption[]
}

export default function ListingsPage(props: ListingsProps) {
  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image
  let searchString = props.initialSearch || ""
  const url = new URL(document.location.toString())
  const searchParam = url.searchParams.get("search")

  // override the search value if present in url
  if (searchParam) {
    searchString = searchParam
  }
  return (
    <LayoutWithoutFooter>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <ListingsSearchCombined
        listingsEndpoint={props.listingsEndpoint}
        googleMapsApiKey={props.googleMapsApiKey}
        searchString={searchString}
        bedrooms={props.bedrooms}
        bathrooms={props.bathrooms}
        counties={props.locations}
      />
    </LayoutWithoutFooter>
  )
}

export function getServerSideProps() {
  return {
    props: {
      listingsEndpoint: getListingServiceUrl(),
      googleMapsApiKey: runtimeConfig.getGoogleMapsApiKey(),
      // show Bloom counties by default
      initialSearch: "counties:Alameda,San Mateo,Santa Clara",
      bedrooms: bedroomOptions,
      bathrooms: bathroomOptions,
      locations: locations,
    },
  }
}
