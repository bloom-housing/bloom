import Head from "next/head"
import { ListingsGroup, PageHeader, t } from "@bloom-housing/ui-components"
import { Listing, ListingStatus } from "@bloom-housing/backend-core/types"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import { getListings } from "../lib/helpers"
import { fetchBaseListingData } from "../lib/hooks"

export interface ListingsProps {
  openListings: Listing[]
  closedListings: Listing[]
}

const openListings = (listings) => {
  return listings?.length > 0 ? (
    <>{getListings(listings)}</>
  ) : (
    <div className="notice-block">
      <h3 className="m-auto text-gray-800">{t("listings.noOpenListings")}</h3>
    </div>
  )
}

const closedListings = (listings) => {
  return (
    listings?.length > 0 && (
      <ListingsGroup
        listingsCount={listings.length}
        header={t("listings.closedListings")}
        hideButtonText={t("listings.hideClosedListings")}
        showButtonText={t("listings.showClosedListings")}
      >
        {getListings(listings)}
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
  const listings = await fetchBaseListingData()
  const openListings = listings.filter(
    (listing: Listing) => listing.status === ListingStatus.active
  )
  const closedListings = listings.filter(
    (listing: Listing) => listing.status === ListingStatus.closed
  )

  return { props: { openListings, closedListings }, revalidate: process.env.cacheRevalidate }
}
