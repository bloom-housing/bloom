import React from "react"
import Head from "next/head"
import axios from "axios"
import { Listing } from "@bloom-housing/backend-core/types"
import { imageUrlFromListing, t } from "@bloom-housing/ui-components"
import Layout from "../../../layouts/application"
import { ListingView } from "../../../src/ListingView"
import { MetaTags } from "../../../src/MetaTags"
import { ErrorPage } from "../../_error"

interface ListingProps {
  listing: Listing
}

export default function ListingPage(props: ListingProps) {
  const { listing } = props

  if (!listing) {
    return <ErrorPage />
  }

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

export async function getStaticPaths(context: { locales: Array<string> }) {
  let response

  try {
    response = await axios.get(
      process.env.listingServiceUrl + "?filter[$comparison]=<>&filter[status]=pending"
    )
  } catch (e) {
    return {
      paths: [],
      fallback: false,
    }
  }

  return {
    paths: context.locales.flatMap((locale: string) =>
      response.data.map((listing) => ({
        params: { id: listing.id, slug: listing.urlSlug },
        locale: locale,
      }))
    ),
    fallback: true,
  }
}

export async function getStaticProps(context: { params: Record<string, string> }) {
  const response = await axios.get(
    `${process.env.backendApiBase}/listings/${context.params.id}?route=public-listing-static-props`
  )

  return {
    props: {
      listing: response.data,
    },
    revalidate: process.env.cacheRevalidate,
  }
}
