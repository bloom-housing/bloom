import Layout from "../layouts"
import Head from "next/head"
import { Hero, t } from "@bloom-housing/ui-components"

export default () => {
  const pageTitle = t("errors.unauthorized.title")

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Hero title={pageTitle} buttonTitle={t("welcome.seeRentalListings")} buttonLink="/listings">
        {t("errors.unauthorized.message")}
      </Hero>
    </Layout>
  )
}
