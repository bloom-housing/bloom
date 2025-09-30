import React, { useEffect, useContext } from "react"
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
import { ListingView } from "../../../components/listing/ListingView"
import { ErrorPage } from "../../_error"
import dayjs from "dayjs"
import { fetchJurisdictionByName } from "../../../lib/hooks"
import {
  Jurisdiction,
  Listing,
  ListingsStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingViewSeeds } from "../../../components/listing/ListingViewSeeds"

interface ListingProps {
  listing: Listing
  jurisdiction: Jurisdiction
}

export default function ListingPage(props: ListingProps) {
  const { listing } = props

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
  const metaImage = imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0]

  return (
    <Layout
      pageTitle={listing.name}
      metaImage={metaImage}
      metaDescription={metaDescription}
      // search engines should not crawl for closed listings
      noIndex={listing.status === ListingsStatusEnum.closed}
    >
      {process.env.showNewSeedsDesigns ? (
        <ListingViewSeeds listing={listing} profile={profile} jurisdiction={props.jurisdiction} />
      ) : (
        <ListingView listing={listing} jurisdiction={props.jurisdiction} />
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
  try {
    response = await axios.get(`${process.env.backendApiBase}/listings/${context.params.id}`, {
      headers: {
        language: context.locale,
        passkey: process.env.API_PASS_KEY,
      },
    })
  } catch (e) {
    return { notFound: true }
  }
  const jurisdiction = fetchJurisdictionByName()

  return {
    props: { listing: response.data, jurisdiction: await jurisdiction },
    revalidate: Number(process.env.cacheRevalidate),
  }
}
