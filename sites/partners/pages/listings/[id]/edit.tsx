import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { PageHeader, t } from "@bloom-housing/ui-components"
import Layout from "../../../layouts"
import PaperListingForm from "../../../src/listings/PaperListingForm"
import { useSingleListingData } from "../../../lib/hooks"
import { ListingContext } from "../../../src/listings/ListingContext"
import { MetaTags } from "../../../src/MetaTags"
import ListingGuard from "../../../src/ListingGuard"

const EditListing = () => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image

  const router = useRouter()
  const listingId = router.query.id as string

  const { listingDto } = useSingleListingData(listingId)

  if (!listingDto) return false

  /**
   * purposely leaving out the assets fallback, so when this gets to production
   * a user can easily see the old asset on the detail, but not here, so we can upload it properly (this should only apply to older listings)
   */
  if (listingDto.images.length === 0) {
    listingDto.images = [{ ordinal: 0, image: { fileId: "", label: "" } }]
  }

  return (
    <ListingContext.Provider value={listingDto}>
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
                  {t("t.edit")}: {listingDto.name}
                </p>

                <p className="font-sans text-base mt-1">{listingDto.id}</p>
              </>
            }
          />

          <PaperListingForm listing={listingDto} editMode />
        </Layout>
      </ListingGuard>
    </ListingContext.Provider>
  )
}

export default EditListing
