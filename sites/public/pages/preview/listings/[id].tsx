import React, { useState } from "react"
import Head from "next/head"
import axios from "axios"
import { Listing } from "@bloom-housing/backend-core/types"
import { t } from "@bloom-housing/ui-components"
import { imageUrlFromListing } from "@bloom-housing/shared-helpers"

import Layout from "../../../layouts/application"
import { ListingView } from "../../../src/ListingView"
import { MetaTags } from "../../../src/MetaTags"

interface ListingProps {
  listing: Listing
}

export default function ListingPage(props: ListingProps) {
  const { listing } = props
  const [previewBarVisible, setPreviewBarVisible] = useState(true)
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
      {previewBarVisible && (
        <div className="pt-6 pb-4 bg-red-700 text-white font-bold text-sm">
          <div className="max-w-5xl m-auto">{t("listings.listingPreviewOnly")}</div>
          <button
            className="-mt-8 alert-box__close text-white"
            onClick={() => {
              setPreviewBarVisible(false)
            }}
          >
            &times;
          </button>
        </div>
      )}
      <ListingView listing={listing} preview={false} />
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

  return { props: { listing: response.data } }
}
