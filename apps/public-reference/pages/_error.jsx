import Layout from "../layouts/application"
import Head from "next/head"
import t from "@bloom-housing/ui-components/src/helpers/translator"
import Hero from "@bloom-housing/ui-components/src/headers/Hero/Hero"
import MarkdownSection from "@bloom-housing/ui-components/src/sections/markdown_section"
import PageContent from "../page_content/homepage.mdx"

export default () => {
  const pageTitle = <>{t("error.notFound.title")}</>

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
