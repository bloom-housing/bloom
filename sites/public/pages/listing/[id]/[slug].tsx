import React, { useEffect, useContext } from "react"
import Head from "next/head"
import axios from "axios"
import { AuthContext, ListingDividerLine, t } from "@bloom-housing/ui-components"
import { Listing, ListingMetadata } from "@bloom-housing/backend-core/types"
import { imageUrlFromListing, ListingDetail, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../../lib/constants"
import Layout from "../../../layouts/application"
import { ListingView } from "../../../src/ListingView"
import { MetaTags } from "../../../src/MetaTags"
import { ErrorPage } from "../../_error"
import dayjs from "dayjs"

interface ListingProps {
  listing: Listing
  listingMetadata: ListingMetadata
}

export default function ListingPage(props: ListingProps) {
  const { listing, listingMetadata } = props

  const pageTitle = `${listing.name} - ${t("nav.siteTitle")}`
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    if (!listing.id) return
    pushGtmEvent<ListingDetail>({
      event: "pageView",
      pageTitle: `${listing.name} - Housing Portal`,
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
      listingStartDate: dayjs(listing.applicationOpenDate).format("YYYY-MM-DD"),
      listingStatus: listing.status,
      listingType: listing.reviewOrderType,
      listingID: listing.id,
      applicationDueDate: dayjs(listing.applicationDueDate).format("YYYY-MM-DD"),
      digitalApplication: listing.digitalApplication,
      paperApplication: listing.paperApplication,
    })
  }, [
    listing.applicationDueDate,
    listing.applicationOpenDate,
    listing.digitalApplication,
    listing.id,
    listing.name,
    listing.paperApplication,
    listing.reviewOrderType,
    listing.status,
    profile,
  ])

  if (!listing) {
    return <ErrorPage />
  }

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
      <span className="hidden md:block">
        <ListingDividerLine />
      </span>
      <ListingView listing={listing} allowFavoriting={true} listingMetadata={listingMetadata} />
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
  let listingResponse, listingMetadataResponse

  try {
    listingResponse = await axios.get(
      `${process.env.backendApiBase}/listings/${context.params.id}`,
      {
        headers: { language: context.locale },
      }
    )

    listingMetadataResponse = await axios.get(`${process.env.backendApiBase}/listings/meta`, {
      headers: { language: context.locale },
    })
  } catch (e) {
    return { notFound: true }
  }

  return { props: { listing: listingResponse.data, listingMetadata: listingMetadataResponse.data } }
}
