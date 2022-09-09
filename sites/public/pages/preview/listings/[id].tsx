import React from "react"
import Head from "next/head"
import axios from "axios"
import { Listing, ListingMetadata } from "@bloom-housing/backend-core/types"
import { AlertBox, t } from "@bloom-housing/ui-components"
import { imageUrlFromListing } from "@bloom-housing/shared-helpers"

import Layout from "../../../layouts/application"
import { ListingView } from "../../../src/ListingView"
import { MetaTags } from "../../../src/MetaTags"

interface ListingProps {
  listing: Listing
  listingMetadata: ListingMetadata
}

export default function ListingPage(props: ListingProps) {
  const { listing, listingMetadata } = props
  const pageTitle = `${listing.name} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.listing", {
    regionName: t("region.name"),
    listingName: listing.name,
  })
  const metaImage = imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0]

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <MetaTags title={listing.name} image={metaImage} description={metaDescription} />
      <AlertBox
        className="pt-6 pb-4 bg-red-700 font-bold text-sm"
        type="alert"
        boundToLayoutWidth
        inverted
        closeable
      >
        {t("listings.listingPreviewOnly")}
      </AlertBox>
      <ListingView listing={listing} preview={false} listingMetadata={listingMetadata} />
    </Layout>
  )
}

export async function getServerSideProps(context: { params: Record<string, string> }) {
  let listingResponse, listingMetadataResponse

  try {
    listingResponse = await axios.get(`${process.env.backendApiBase}/listings/${context.params.id}`)

    listingMetadataResponse = await axios.get(`${process.env.backendApiBase}/listings/meta`, {
      headers: { language: "en" },
    })
  } catch (e) {
    return { notFound: true }
  }

  return { props: { listing: listingResponse.data, listingMetadata: listingMetadataResponse.data } }
}
