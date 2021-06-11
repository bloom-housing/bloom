import React from "react"
import Head from "next/head"
import { PageHeader, SiteAlert, t } from "@bloom-housing/ui-components"
import Layout from "../../layouts"
import PaperListingForm from "../../src/listings/PaperListingForm"
import { MetaTags } from "../../src/MetaTags"

const NewListing = () => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />

      <PageHeader className="relative" title={t("listings.newListing")}>
        <div className="flex top-4 right-4 absolute z-50 flex-col items-center">
          <SiteAlert type="success" timeout={5000} dismissable />
        </div>
      </PageHeader>

      <PaperListingForm />
    </Layout>
  )
}

export default NewListing
