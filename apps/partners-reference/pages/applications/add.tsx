import React from "react"
import Head from "next/head"
import { PageHeader, t, MetaTags } from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import ApplicationForm from "../../src/applications/ApplicationForm/ApplicationForm"

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

      <ApplicationForm isEditable={false} />
    </Layout>
  )
}

export default NewApplication
