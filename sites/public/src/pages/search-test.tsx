import Head from "next/head"
import Layout from "../layouts/application"
import { MetaTags } from "../components/shared/MetaTags"
import { PageHeader, t } from "@bloom-housing/doorway-ui-components"
import { FormOption } from "../components/listings/search/ListingsSearchForm"
import { ListingsSearchCombined } from "../components/listings/search/ListingsSearchCombined"
import { getListingServiceUrl } from "../lib/helpers"

type SearchTestProps = {
  listingsEndpoint: string
  bedrooms: FormOption[]
  bathrooms: FormOption[]
  locations: FormOption[]
}

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

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader title={t("pageTitle.rent")} />
      {/*<ListingsCombined listings={props.listings} />*/}

      <ListingsSearchCombined
        listingsEndpoint={props.listingsEndpoint}
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
      bedrooms: bedroomOptions,
      bathrooms: bathroomOptions,
      locations: locations
    },
  }
}
