import React, { useState } from "react"
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
import { logger } from "../../../logger"

const EditListing = (props: { listing: Listing }) => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image

  const { listing } = props
  const [listingName, setListingName] = useState(listing?.name)

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
                  {t("t.edit")}: {listingName}
                </p>

                <p className="font-sans text-base mt-1">{listing.id}</p>
              </>
            }
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
            listing={listing as FormListing}
            editMode
            setListingName={setListingName}
          />
        </Layout>
      </ListingGuard>
    </ListingContext.Provider>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { params: Record<string, string>; req: any }) {
  let response
  const backendUrl = `/listings/${context.params.id}`
  const headers: Record<string, string> = {
    "x-forwarded-for": context.req.headers["x-forwarded-for"] ?? context.req.socket.remoteAddress,
  }

  if (process.env.API_PASS_KEY) {
    headers.passkey = process.env.API_PASS_KEY
  }
  try {
    logger.info(`GET - ${backendUrl}`)
    response = await axios.get(`${process.env.backendApiBase}${backendUrl}`, {
      headers,
    })
  } catch (e) {
    if (e.response) {
      logger.error(`GET - ${backendUrl} - ${e.response?.status} - ${e.response?.statusText}`)
    } else {
      logger.error("partner backend url adapter error:", e)
    }
    return { notFound: true }
  }

  return { props: { listing: response.data } }
}

export default EditListing
