import React from "react"
import Head from "next/head"
import axios from "axios"
import { Listing } from "@bloom-housing/backend-core/types"
import { t } from "@bloom-housing/ui-components"
import { imageUrlFromListing } from "@bloom-housing/shared-helpers"

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
  const metaImage = imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))

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
/**
 *
 * getStaticPaths and getStaticProps with revalidation isn't actually working on netflify, so we have to use getServerSideProps until it does
 */
/* export async function getStaticPaths(context: { locales: Array<string> }) {
  try {
    const response = await axios.get(process.env.listingServiceUrl, {
      params: {
        view: "base",
        limit: "all",
        filter: [
          {
            $comparison: "<>",
            status: "pending",
          },
        ],
      },
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
    })

    return {
      paths: response?.data?.items
        ? context.locales.flatMap((locale: string) =>
            response.data.items.map((listing) => ({
              params: { id: listing.id, slug: listing.urlSlug },
              locale: locale,
            }))
          )
        : [],
      fallback: "blocking",
    }
  } catch (error) {
    console.error("listings getStaticPaths error = ", error)
    return {
      paths: [],
      fallback: "blocking",
    }
  }
} */

export async function getServerSideProps(context: {
  params: Record<string, string>
  locale: string
}) {
  let response

  try {
    response = await axios.get(`${process.env.backendApiBase}/listings/${context.params.id}`, {
      headers: { language: context.locale },
    })
  } catch (e) {
    return { notFound: true }
  }

  return { props: { listing: response.data } }
}
