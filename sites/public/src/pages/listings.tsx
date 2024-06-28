import React from "react"
import Head from "next/head"
import { t } from "@bloom-housing/ui-components"
import { MetaTags } from "../components/shared/MetaTags"
import ListingsSearchCombined, {
  locations,
} from "../components/listings/search/ListingsSearchCombined"
import { FormOption } from "../components/listings/search/ListingsSearchModal"
import { runtimeConfig } from "../lib/runtime-config"
import Layout from "../layouts/application"

export interface ListingsProps {
  listingsEndpoint: string
  googleMapsApiKey: string
  bedrooms: FormOption[]
  bathrooms: FormOption[]
}

export default function ListingsPage(props: ListingsProps) {
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
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <ListingsSearchCombined
        googleMapsApiKey={props.googleMapsApiKey}
        searchString={searchString}
        bedrooms={props.bedrooms}
        bathrooms={props.bathrooms}
        counties={locations}
      />
    </Layout>
  )
}

export function getServerSideProps() {
  return {
    props: {
      googleMapsApiKey: runtimeConfig.getGoogleMapsApiKey(),
    },
  }
}
