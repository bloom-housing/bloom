import React from "react"
import Head from "next/head"
import {
  AppearanceStyleType,
  Button,
  MetaTags,
  PageHeader,
  StatusBar,
  t,
} from "@bloom-housing/ui-components"
import Layout from "../../../../layouts/application"
import PaperApplicationForm from "../../../../src/applications/PaperApplicationForm/PaperApplicationForm"
import { useRouter } from "next/router"

const NewApplication = () => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image

  const router = useRouter()
  const listingId = router.query.id as string

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader>{t("applications.newApplication")}</PageHeader>

      <StatusBar
        backButton={
          <Button inlineIcon="left" icon="arrow-back" onClick={() => router.back()}>
            {t("t.back")}
          </Button>
        }
        tagStyle={AppearanceStyleType.primary}
        tagLabel={t(`application.details.applicationStatus.draft`)}
      />

      <PaperApplicationForm listingId={listingId} />
    </Layout>
  )
}

export default NewApplication
