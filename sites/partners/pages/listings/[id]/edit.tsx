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

  // Set listing photo from assets if necessary:
  if (listingDto.image == null && listingDto.assets.length > 0) {
    listingDto.image = listingDto.assets.find((asset) => asset.label == "building")
  }
  // If that didn't do the trick, set a default:
  if (listingDto.image == null) {
    listingDto.image = { fileId: "", label: "" }
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
            className={"md:pt-16"}
          />

          <PaperListingForm listing={listingDto} editMode />
        </Layout>
      </ListingGuard>
    </ListingContext.Provider>
  )
}

export default EditListing
