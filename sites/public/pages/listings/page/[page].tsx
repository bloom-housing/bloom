import Head from "next/head"
import axios from "axios"
import { ListingsList, PageHeader, t } from "@bloom-housing/ui-components"
import { Listing, PaginatedListings } from "@bloom-housing/backend-core/types"
import Layout from "../../../layouts/application"
import { MetaTags } from "../../../src/MetaTags"

export interface ListingsProps {
  listings: Listing[]
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
      <div>{openListings(props.listings)}</div>
    </Layout>
  )
}

export async function getStaticPaths(context: { locales: Array<string> }) {
  try {
    const response: PaginatedListings = await axios.get(process.env.listingServiceUrl, {
      params: { page: "1", limit: "10" },
    })

    return {
      paths: context.locales.flatMap((locale: string) => ({
        params: { page: response.meta.totalPages },
        locale: locale,
      })),
      fallback: false,
    }
  } catch (e) {
    return {
      paths: [],
      fallback: false,
    }
  }
}

export async function getStaticProps(context: { params: Record<string, string> }) {
  try {
    const response = await axios.get(process.env.listingServiceUrl, {
      params: { page: context.params.page, limit: "10" },
    })
    return { props: { listings: response.data.items }, revalidate: 120 }
  } catch (error) {
    console.error(error)
  }

  return { props: { listings: [] }, revalidate: 120 }
}
