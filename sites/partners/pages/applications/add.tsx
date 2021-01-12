import React from "react"
import Head from "next/head"
import { PageHeader, t, MetaTags } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import PaperApplicationForm from "../src/applications/PaperApplicationForm/PaperApplicationForm"

const NewApplication = () => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader>{t("applications.newApplication")}</PageHeader>

      <PaperApplicationForm />
    </Layout>
  )
}

export default NewApplication
