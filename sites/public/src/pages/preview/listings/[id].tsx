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
  googleMapsMapId: string
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
        googleMapsMapId={props.googleMapsMapId}
        isExternal={false}
      />
    </Layout>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: {
  params: Record<string, string>
  locale: string
  req: any
}) {
  let response

  const listingServiceUrl = runtimeConfig.getListingServiceUrl()

  try {
    const headers: Record<string, string> = {
      "x-forwarded-for": context.req.headers["x-forwarded-for"] ?? context.req.socket.remoteAddress,
      language: context.locale,
    }

    if (process.env.API_PASS_KEY) {
      headers.passkey = process.env.API_PASS_KEY
    }
    response = await axios.get(`${listingServiceUrl}/${context.params.id}`, {
      headers,
    })
  } catch (e) {
    return { notFound: true }
  }

  return {
    props: {
      listing: response.data,
      // There's nothing missing from the listing jurisdiction that
      // requires another call to the jurisdiction endpoint
      jurisdiction: response.data.jurisdictions,
      googleMapsApiKey: runtimeConfig.getGoogleMapsApiKey() || null,
      googleMapsMapId: runtimeConfig.getGoogleMapsMapId() || null,
    },
  }
}
