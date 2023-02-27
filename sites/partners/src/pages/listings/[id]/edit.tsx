import React from "react"
import Head from "next/head"
import axios from "axios"
import { t } from "@bloom-housing/ui-components"
import { PageHeader } from "../../../../../../detroit-ui-components/src/headers/PageHeader"
import { Listing } from "@bloom-housing/backend-core/types"
import Layout from "../../../layouts"
import PaperListingForm from "../../../components/listings/PaperListingForm"
import { ListingContext } from "../../../components/listings/ListingContext"
import { MetaTags } from "../../../components/shared/MetaTags"
import ListingGuard from "../../../components/shared/ListingGuard"

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

          <PageHeader
            title={
              <>
                <p className="font-sans font-semibold uppercase text-3xl">
                  {t("t.edit")}: {listing.name}
                </p>

                <p className="font-sans text-base mt-1">{listing.id}</p>
              </>
            }
            className={"md:pt-16"}
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
