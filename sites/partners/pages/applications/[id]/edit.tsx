import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { PageHeader, t, MetaTags } from "@bloom-housing/ui-components"
import Layout from "../../../layouts/application"
import PaperApplicationForm from "../../../src/applications/PaperApplicationForm/PaperApplicationForm"
import { useSingleApplicationData } from "../../../lib/hooks"

const NewApplication = () => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image

  const router = useRouter()
  const applicationId = router.query.id as string

  const { application } = useSingleApplicationData(applicationId)

  if (!application) return false

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader>{t("applications.newApplication")}</PageHeader>

      <PaperApplicationForm listingId={application.listing.id} />
    </Layout>
  )
}

export default NewApplication
