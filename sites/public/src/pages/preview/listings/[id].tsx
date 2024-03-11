import React from "react"
import Head from "next/head"
import axios from "axios"
import { AlertBox, t } from "@bloom-housing/ui-components"
import { imageUrlFromListing } from "@bloom-housing/shared-helpers"
import Layout from "../../../layouts/application"
import { ListingView, ListingViewListing } from "../../../components/listing/ListingView"
import { MetaTags } from "../../../components/shared/MetaTags"
import { runtimeConfig } from "../../../lib/runtime-config"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

interface ListingProps {
  listing: Listing
  jurisdiction: Jurisdiction
  googleMapsApiKey: string
}

export default function ListingPage(props: ListingProps) {
  const { listing } = props
  const pageTitle = `${listing.name} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.listing", {
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
        className="pt-6 pb-4 bg-red-500 font-bold text-xs"
        type="alert"
        boundToLayoutWidth
        inverted
        closeable
      >
        {t("listings.listingPreviewOnly")}
      </AlertBox>
      <ListingView
        listing={listing as ListingViewListing}
        preview={true}
        jurisdiction={props.jurisdiction}
        googleMapsApiKey={props.googleMapsApiKey}
        isExternal={false}
      />
    </Layout>
  )
}

export async function getServerSideProps(context: { params: Record<string, string> }) {
  let response

  const listingServiceUrl = runtimeConfig.getListingServiceUrl()

  try {
    response = await axios.get(`${listingServiceUrl}/${context.params.id}`)
  } catch (e) {
    return { notFound: true }
  }

  return {
    props: {
      listing: response.data,
      // There's nothing missing from the listing jurisdiction that
      // requires another call to the jurisdiction endpoint
      jurisdiction: response.data.jurisdiction,
      googleMapsApiKey: runtimeConfig.getGoogleMapsApiKey(),
    },
  }
}
