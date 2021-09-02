import Head from "next/head"
import qs from "qs"
import axios from "axios"
import { ListingsGroup, ListingsList, PageHeader, t } from "@bloom-housing/ui-components"
import { Listing, ListingStatus } from "@bloom-housing/backend-core/types"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"

export interface ListingsProps {
  openListings: Listing[]
  closedListings: Listing[]
}

const openListings = (listings) => {
  return listings.length > 0 ? (
    <ListingsList listings={listings} />
  ) : (
    <div className="notice-block">
      <h3 className="m-auto text-gray-800">{t("listings.noOpenListings")}</h3>
    </div>
  )
}

const closedListings = (listings) => {
  return (
    listings.length > 0 && (
      <ListingsGroup
        listingsCount={listings.length}
        header={t("listings.closedListings")}
        hideButtonText={t("listings.hideClosedListings")}
        showButtonText={t("listings.showClosedListings")}
      >
        <ListingsList listings={listings} />
      </ListingsGroup>
    )
  )
}

export default function ListingsPage(props: ListingsProps) {
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
      <div>
        {openListings(props.openListings)}
        {closedListings(props.closedListings)}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  let openListings = []
  let closedListings = []

  try {
    const response = await axios.get(process.env.listingServiceUrl, {
      params: {
        view: "base",
        limit: "all",
        filter: [
          {
            $comparison: "<>",
            status: "pending"
          }
        ]
      },
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
    })

    openListings = response?.data?.items
      ? response.data.items.filter((listing: Listing) => listing.status === ListingStatus.active)
      : []
    closedListings = response?.data?.items
      ? response.data.items.filter((listing: Listing) => listing.status === ListingStatus.closed)
      : []
  } catch (error) {
    console.error(error)
  }

  return { props: { openListings, closedListings }, revalidate: process.env.cacheRevalidate }
}
