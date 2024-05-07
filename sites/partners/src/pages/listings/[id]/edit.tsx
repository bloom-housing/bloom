import React from "react"
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
import { FormListing } from "../../../lib/listings/formTypes"

const EditListing = (props: { listing: Listing }) => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image

  const { listing } = props

  if (!listing) return false

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

          <PaperListingForm listing={listing as FormListing} editMode />
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
