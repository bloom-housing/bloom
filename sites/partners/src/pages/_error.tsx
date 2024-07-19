import Layout from "../layouts"
import Head from "next/head"
import { Hero, MarkdownSection, t } from "@bloom-housing/ui-components"

const Error = () => {
  const pageTitle = t("errors.notFound.title")

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Hero title={pageTitle} buttonTitle={t("welcome.seeRentalListings")} buttonLink="/listings">
        {t("errors.notFound.message")}
      </Hero>
      <div className="homepage-extra">
        <MarkdownSection fullwidth={true}>{t("t.errorOccurred")}</MarkdownSection>
      </div>
    </Layout>
  )
}

export default Error
