import React from "react"
import Head from "next/head"
import { MetaTags, PageHeader, t } from "@bloom-housing/ui-components"
import Layout from "../../../layouts/application"
import PaperApplicationForm from "../../../src/applications/PaperApplicationForm/PaperApplicationForm"
import { useRouter } from "next/router"

const NewApplication = () => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image

  const router = useRouter()
  const listingId = router.query.listing as string

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader title={t("applications.newApplication")} />

      <PaperApplicationForm listingId={listingId} />
    </Layout>
  )
}

export default NewApplication
