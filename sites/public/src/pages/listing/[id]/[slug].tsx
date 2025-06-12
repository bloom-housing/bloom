import React, { useEffect, useContext } from "react"
import Head from "next/head"
import { GetStaticPaths, GetStaticProps } from "next"
import axios from "axios"
import { t } from "@bloom-housing/ui-components"
import {
  imageUrlFromListing,
  ListingDetail,
  pushGtmEvent,
  AuthContext,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../../lib/constants"
import Layout from "../../../layouts/application"
import { ListingView, ListingViewListing } from "../../../components/listing/ListingView"
import { MetaTags } from "../../../components/shared/MetaTags"
import { ErrorPage } from "../../_error"
import dayjs from "dayjs"
import { runtimeConfig } from "../../../lib/runtime-config"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingViewSeeds } from "../../../components/listing/ListingViewSeeds"

interface ListingProps {
  listing: Listing
  jurisdiction: Jurisdiction
  googleMapsApiKey: string
  googleMapsMapId: string
}

export default function ListingPage(props: ListingProps) {
  const { listing } = props

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
    listingName: listing.name,
  })
  const metaImage = imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0]

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <MetaTags title={listing.name} image={metaImage} description={metaDescription} />
      {process.env.showNewSeedsDesigns ? (
        <ListingViewSeeds listing={listing} profile={profile} jurisdiction={props.jurisdiction} />
      ) : (
        <ListingView
          listing={listing as ListingViewListing}
          jurisdiction={props.jurisdiction}
          googleMapsApiKey={props.googleMapsApiKey}
          googleMapsMapId={props.googleMapsMapId}
          isExternal={false}
        />
      )}
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
}

export const getStaticProps: GetStaticProps = async (context: {
  params: Record<string, string>
  locale: string
}) => {
  let response
  const listingServiceUrl = runtimeConfig.getListingServiceUrl()

  try {
    response = await axios.get(`${listingServiceUrl}/${context.params.id}`, {
      headers: {
        language: context.locale,
        passkey: process.env.API_PASS_KEY,
      },
    })
  } catch (e) {
    console.error("slug notFound Error:", e)
    return { notFound: true, revalidate: Number(process.env.cacheRevalidate) }
  }
  return {
    props: {
      listing: response.data,
      jurisdiction: response.data.jurisdictions,
      googleMapsApiKey: runtimeConfig.getGoogleMapsApiKey() || null,
      googleMapsMapId: runtimeConfig.getGoogleMapsMapId() || null,
    },
    revalidate: Number(process.env.cacheRevalidate),
  }
}
