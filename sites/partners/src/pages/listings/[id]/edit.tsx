import React from "react"
import Head from "next/head"
import axios from "axios"
import { t, Breadcrumbs, BreadcrumbLink } from "@bloom-housing/ui-components"
import { Listing } from "@bloom-housing/backend-core/types"
import Layout from "../../../layouts"
import PaperListingForm from "../../../components/listings/PaperListingForm"
import { ListingContext } from "../../../components/listings/ListingContext"
import { MetaTags } from "../../../components/shared/MetaTags"
import ListingGuard from "../../../components/shared/ListingGuard"
import { NavigationHeader } from "../../../components/shared/NavigationHeader"

const EditListing = (props: { listing: Listing }) => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image

  const { listing } = props

  if (!listing) return false

  /**
   * purposely leaving out the assets fallback, so when this gets to production
   * a user can easily see the old asset on the detail, but not here, so we can upload it properly (this should only apply to older listings)
   */
  if (listing.images.length === 0) {
    listing.images = [{ ordinal: 0, image: { fileId: "", label: "" }, imageId: undefined }]
  }

  return (
    <ListingContext.Provider value={listing}>
      <ListingGuard>
        <Layout>
          <Head>
            <title>{t("nav.siteTitlePartners")}</title>
          </Head>

          <MetaTags
            title={t("nav.siteTitlePartners")}
            image={metaImage}
            description={metaDescription}
          />

          <NavigationHeader
            title={
              <>
                <p className="font-sans font-semibold uppercase text-2xl">
                  {t("t.edit")}: {listing.name}
                </p>

                <p className="font-sans text-base mt-1">{listing.id}</p>
              </>
            }
            breadcrumbs={
              <Breadcrumbs>
                <BreadcrumbLink href="/">{t("t.listing")}</BreadcrumbLink>
                <BreadcrumbLink href={`/listings/${listing.id}`}>{listing.name}</BreadcrumbLink>
                <BreadcrumbLink href={`/listings/${listing.id}/edit`} current>
                  {t("t.edit")}
                </BreadcrumbLink>
              </Breadcrumbs>
            }
          />

          <PaperListingForm listing={listing} editMode />
        </Layout>
      </ListingGuard>
    </ListingContext.Provider>
  )
}

export async function getServerSideProps(context: { params: Record<string, string> }) {
  let response

  try {
    response = await axios.get(`${process.env.backendApiBase}/listings/${context.params.id}`)
  } catch (e) {
    console.log("e = ", e)
    return { notFound: true }
  }

  return { props: { listing: response.data } }
}

export default EditListing
