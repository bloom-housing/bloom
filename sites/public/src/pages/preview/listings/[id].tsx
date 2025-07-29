import React, { useContext } from "react"
import axios from "axios"
import { t } from "@bloom-housing/ui-components"
import { AuthContext, imageUrlFromListing } from "@bloom-housing/shared-helpers"

import Layout from "../../../layouts/application"
import { ListingViewSeeds } from "../../../components/listing/ListingViewSeeds"
import { ListingView } from "../../../components/listing/ListingView"
import { fetchJurisdictionByName } from "../../../lib/hooks"
import { Jurisdiction, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Alert } from "@bloom-housing/ui-seeds"

interface ListingProps {
  listing: Listing
  jurisdiction: Jurisdiction
}

export default function ListingPage(props: ListingProps) {
  const { listing } = props
  const { profile } = useContext(AuthContext)
  const metaDescription = t("pageDescription.listing", {
    regionName: t("region.name"),
    listingName: listing.name,
  })
  const metaImage = imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0]

  return (
    <Layout
      pageTitle={`${t("pageTitle.preview")} - ${listing.name}`}
      metaImage={metaImage}
      metaDescription={metaDescription}
    >
      <Alert variant="alert-inverse" fullwidth className="fullscreen-alert">
        {t("listings.listingPreviewOnly")}
      </Alert>
      {process.env.showNewSeedsDesigns ? (
        <ListingViewSeeds
          listing={listing}
          preview={true}
          profile={profile}
          jurisdiction={props.jurisdiction}
        />
      ) : (
        <ListingView listing={listing} preview={true} jurisdiction={props.jurisdiction} />
      )}
    </Layout>
  )
}

export async function getServerSideProps(context: {
  params: Record<string, string>
  locale: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: any
}) {
  let response

  try {
    response = await axios.get(`${process.env.backendApiBase}/listings/${context.params.id}`, {
      headers: {
        language: context.locale,
        passkey: process.env.API_PASS_KEY,
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
