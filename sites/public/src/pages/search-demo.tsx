import React from "react"
import Head from "next/head"
import Layout from "../layouts/application"
import { MetaTags } from "../components/shared/MetaTags"
import { PageHeader, t } from "@bloom-housing/doorway-ui-components"
import { FormOption } from "../components/listings/search/ListingsSearchForm"
import { ListingsSearchCombined } from "../components/listings/search/ListingsSearchCombined"
import { getListingServiceUrl } from "../lib/helpers"
import { runtimeConfig } from "../lib/runtime-config"

type SearchTestProps = {
  listingsEndpoint: string
  googleMapsApiKey: string
  initialSearch?: string
  bedrooms: FormOption[]
  bathrooms: FormOption[]
  locations: FormOption[]
}

// Input values/options below are passed into the form to make it easier to
// reuse it in multiple places.  This may not ultimately be necessary, but it's
// easier to add it in at the beginning than it is to try to add make the change
// later.

const bedroomOptions: FormOption[] = [
  {
    label: "Any",
    value: null,
  },
  {
    label: "Studio",
    value: "0",
  },
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
  {
    label: "4+",
    value: "4",
  },
]

const bathroomOptions: FormOption[] = [
  {
    label: "Any",
    value: null,
  },
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
  {
    label: "4+",
    value: "4",
  },
]

const locations: FormOption[] = [
  {
    label: "Alameda",
    value: "Alameda",
  },
  {
    label: "Contra Costa",
    value: "Contra Costa",
  },
  {
    label: "Marin",
    value: "Marin",
  },
  {
    label: "San Francisco",
    value: "San Francisco",
    //isDisabled: true,
  },
  {
    label: "San Mateo",
    value: "San Mateo",
  },
  {
    label: "Santa Clara",
    value: "Santa Clara",
  },
  {
    label: "Solano",
    value: "Solano",
  },
  {
    label: "Sonoma",
    value: "Sonoma",
  },
]

export default function SearchTest(props: SearchTestProps) {
  //const { profile } = useContext(AuthContext)
  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  // set a default search value
  let searchString = props.initialSearch || ""

  const url = new URL(document.location.toString())
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
      <PageHeader title={t("pageTitle.rent")} />

      <ListingsSearchCombined
        listingsEndpoint={props.listingsEndpoint}
        googleMapsApiKey={props.googleMapsApiKey}
        searchString={searchString}
        bedrooms={props.bedrooms}
        bathrooms={props.bathrooms}
        counties={props.locations}
      />
    </Layout>
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
