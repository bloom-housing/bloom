import React from "react"
import Head from "next/head"
import axios from "axios"
import { Listing } from "@bloom-housing/backend-core/types"
import { imageUrlFromListing, MetaTags, t } from "@bloom-housing/ui-components"
import Layout from "../../../layouts/application"
import { ListingView } from "../../../src/ListingView"

interface ListingProps {
  listing: Listing
}

export default function ListingPage(props: ListingProps) {
  const { listing } = props
  const pageTitle = `${listing.name} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.listing", {
    regionName: t("region.name"),
    listingName: listing.name,
  })
  const metaImage = imageUrlFromListing(listing)

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <MetaTags title={listing.name} image={metaImage} description={metaDescription} />
      <ListingView listing={listing} />
    </Layout>
  )
}

export async function getStaticPaths(context: any) {
  const response = await axios.get(process.env.listingServiceUrl)

  return {
    paths: context.locales.flatMap((locale: any) =>
      response.data.map((listing) => ({
        params: { id: listing.id, slug: listing.urlSlug },
        locale: locale,
      }))
    ),
    fallback: false,
  }
}

export async function getStaticProps(context: any) {
  const response = await axios.get(`${process.env.backendApiBase}/listings/${context.params.id}`)

  return {
    props: {
      listing: response.data,
    },
  }
}
