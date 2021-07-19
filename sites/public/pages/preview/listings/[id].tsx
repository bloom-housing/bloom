import React, { useState } from "react"
import Head from "next/head"
import axios from "axios"
import { Listing } from "@bloom-housing/backend-core/types"
import { imageUrlFromListing, t } from "@bloom-housing/ui-components"
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
  const metaImage = imageUrlFromListing(listing)

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <MetaTags title={listing.name} image={metaImage} description={metaDescription} />
      {previewBarVisible && (
        <div
          className="bg-red-700 text-white font-bold text-sm"
          style={{ padding: "1.5rem 0 1rem" }}
        >
          <div className="max-w-5xl m-auto">{t("listings.listingPreviewOnly")}</div>
          <button
            className="alert-box__close text-white"
            style={{ marginTop: "-2rem" }}
            onClick={() => {
              setPreviewBarVisible(false)
            }}
          >
            &times;
          </button>
        </div>
      )}
      <ListingView listing={listing} preview={true} />
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
