import Layout from "../layouts/application"
import Head from "next/head"
import { Hero, MarkdownSection, t } from "@bloom-housing/ui-components"
import PageContent from "../page_content/homepage.mdx"

export default () => {
  const pageTitle = t("error.notFound.title")

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Hero title={pageTitle} buttonTitle={t("welcome.seeRentalListings")} buttonLink="/listings">
        {t("error.notFound.message")}
      </Hero>
      <div className="homepage-extra">
        <MarkdownSection fullwidth={true}>
          <PageContent />
        </MarkdownSection>
      </div>
    </Layout>
  )
}
