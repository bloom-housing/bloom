import Layout from "../layouts"
import Head from "next/head"
import { Hero, t } from "@bloom-housing/ui-components"

const Unauthorized = () => {
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

export default Unauthorized
