import Layout from "../layouts/application"
import Head from "next/head"
import t from "@bloom-housing/ui-components/src/helpers/translator"
import Hero from "@bloom-housing/ui-components/src/headers/Hero/Hero"
import MarkdownSection from "@bloom-housing/ui-components/src/sections/markdown_section"
import PageContent from "../page_content/homepage.mdx"

export default () => {
  const pageTitle = <>Page Not Found</>

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Hero title={pageTitle} buttonTitle={t("welcome.seeRentalListings")} buttonLink="/listings">
        Uh oh, we can’t seem to find the page you’re looking for. Try going back to the previous
        page or click below to browse listings.
      </Hero>
      <div className="homepage-extra">
        <MarkdownSection fullwidth={true}>
          <PageContent />
        </MarkdownSection>
      </div>
    </Layout>
  )
}
