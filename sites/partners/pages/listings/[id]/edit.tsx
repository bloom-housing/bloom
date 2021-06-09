import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { PageHeader, t } from "@bloom-housing/ui-components"
import Layout from "../../../layouts"
import PaperListingForm from "../../../src/listings/PaperListingForm"
import { useSingleListingData } from "../../../lib/hooks"
import { ListingContext } from "../../../src/listings/ListingContext"
import { MetaTags } from "../../../src/MetaTags"

const NewListing = () => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image

  const router = useRouter()
  const listingId = router.query.id as string

  const { listingDto } = useSingleListingData(listingId)

  if (!listingDto) return false

  return (
    <ListingContext.Provider value={listingDto}>
      <Layout>
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>

        <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />

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
    </ListingContext.Provider>
  )
}

export default NewListing
