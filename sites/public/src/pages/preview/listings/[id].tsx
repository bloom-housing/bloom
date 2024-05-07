import React from "react"
import Head from "next/head"
import axios from "axios"
import { AlertBox, t } from "@bloom-housing/ui-components"
import { imageUrlFromListing } from "@bloom-housing/shared-helpers"

import Layout from "../../../layouts/application"
import { ListingView } from "../../../components/listing/ListingView"
import { MetaTags } from "../../../components/shared/MetaTags"
import { fetchJurisdictionByName } from "../../../lib/hooks"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

interface ListingProps {
  listing: Listing
  jurisdiction: Jurisdiction
}

export default function ListingPage(props: ListingProps) {
  const { listing } = props
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
        className="pt-6 pb-4 bg-red-500 font-bold text-xs"
        type="alert"
        boundToLayoutWidth
        inverted
        closeable
      >
        {t("listings.listingPreviewOnly")}
      </AlertBox>
      <ListingView listing={listing} preview={true} jurisdiction={props.jurisdiction} />
    </Layout>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { params: Record<string, string>; req: any }) {
  let response

  try {
    response = await axios.get(`${process.env.backendApiBase}/listings/${context.params.id}`, {
      headers: {
        "x-forwarded-for":
          context.req.headers["x-forwarded-for"] ?? context.req.socket.remoteAddress,
      },
    })
  } catch (e) {
    return { notFound: true }
  }

  const jurisdiction = fetchJurisdictionByName(context.req)

  return { props: { listing: response.data, jurisdiction: await jurisdiction } }
}
