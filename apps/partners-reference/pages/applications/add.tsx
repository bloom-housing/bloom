import React, { Fragment, useMemo } from "react"
import { useRouter } from "next/router"
import moment from "moment"
import Head from "next/head"
import {
  PageHeader,
  t,
  Tag,
  GridSection,
  ViewItem,
  GridCell,
  MinimalTable,
  InlineButton,
} from "@bloom-housing/ui-components"
import { useSingleApplicationData } from "../../lib/hooks"
import Layout from "../../layouts/application"
import ApplicationForm from "../../src/applications/ApplicationForm"

const NewApplication = () => {
  const router = useRouter()

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      {/* <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} /> */}
      <PageHeader>{t("applications.newApplication")}</PageHeader>

      <ApplicationForm isEditable={false} />
    </Layout>
  )
}

export default NewApplication
