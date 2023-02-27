import Layout from "../layouts"
import Head from "next/head"
import { t } from "@bloom-housing/ui-components"
import { Hero } from "../../../../detroit-ui-components/src/headers/Hero"

export default () => {
  const pageTitle = t("errors.unauthorized.title")

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Hero title={pageTitle}>{t("errors.unauthorized.message")}</Hero>
    </Layout>
  )
}
