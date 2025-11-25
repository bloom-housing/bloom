import React, { useState, useCallback } from "react"
import Head from "next/head"
import axios from "axios"
import { t, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Layout from "../../../layouts"
import PaperListingForm from "../../../components/listings/PaperListingForm"
import { ListingContext } from "../../../components/listings/ListingContext"
import { MetaTags } from "../../../components/shared/MetaTags"
import ListingGuard from "../../../components/shared/ListingGuard"
import { NavigationHeader } from "../../../components/shared/NavigationHeader"

const EditListing = (props: { listing: Listing }) => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image

  const { listing: defaultlListing } = props
  const [listing, setListing] = useState<Listing>(defaultlListing)
  const [listingName, setListingName] = useState(listing?.name)

  const updateListing = useCallback((updatedListing: Listing) => {
    setListing(updatedListing)
    setListingName(updatedListing.name)
  }, [])

  if (!listing) return false

  const selectedJurisdiction = listing.jurisdictions.id

  return (
    <ListingContext.Provider value={listing}>
      <ListingGuard>
        <Layout>
          <Head>
            <title>{`Edit ${listingName} - ${t("nav.siteTitlePartners")}`}</title>
          </Head>

          <MetaTags
            title={t("nav.siteTitlePartners")}
            image={metaImage}
            description={metaDescription}
          />

          <NavigationHeader
            title={`${t("t.edit")}: ${listingName}`}
            breadcrumbs={
              <Breadcrumbs>
                <BreadcrumbLink href="/">{t("t.listing")}</BreadcrumbLink>
                <BreadcrumbLink href={`/listings/${listing.id}`}>{listingName}</BreadcrumbLink>
                <BreadcrumbLink href={`/listings/${listing.id}/edit`} current>
                  {t("t.edit")}
                </BreadcrumbLink>
              </Breadcrumbs>
            }
          />
          <PaperListingForm
            jurisdictionId={selectedJurisdiction}
            listing={listing}
            editMode
            setListingName={setListingName}
            updateListing={updateListing}
          />
        </Layout>
      </ListingGuard>
    </ListingContext.Provider>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { params: Record<string, string>; req: any }) {
  let response

  try {
    response = await axios.get(`${process.env.backendApiBase}/listings/${context.params.id}`, {
      headers: {
        passkey: process.env.API_PASS_KEY,
        "x-forwarded-for":
          context.req.headers["x-forwarded-for"] ?? context.req.socket.remoteAddress,
      },
    })
  } catch (e) {
    console.log("e = ", e)
    return { notFound: true }
  }

  return { props: { listing: response.data } }
}

export default EditListing
