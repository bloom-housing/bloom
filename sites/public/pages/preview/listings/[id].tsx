import React from "react"
import Head from "next/head"
import axios from "axios"
import { Jurisdiction, Listing } from "@bloom-housing/backend-core/types"
import { AlertBox, t } from "@bloom-housing/ui-components"
import { imageUrlFromListing } from "@bloom-housing/shared-helpers"

import Layout from "../../../layouts/application"
import { ListingView } from "../../../src/ListingView"
import { MetaTags } from "../../../src/MetaTags"
import { fetchJurisdictionByName } from "../../../lib/hooks"

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
  const metaImage = imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))

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
      <ListingView listing={listing} preview={false} jurisdiction={props.jurisdiction} />
    </Layout>
  )
}

export async function getServerSideProps(context: { params: Record<string, string> }) {
  let response

  try {
    response = await axios.get(`${process.env.backendApiBase}/listings/${context.params.id}`)
  } catch (e) {
    return { notFound: true }
  }

  const jurisdiction = fetchJurisdictionByName()

  return { props: { listing: response.data, jurisdiction: await jurisdiction } }
}
