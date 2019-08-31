import * as React from "react"
import t from "@dahlia/ui-components/src/helpers/translator"
import Layout from "../layouts/application"
import Hero from "@dahlia/ui-components/src/headers/hero"
import MarkdownSection from "@dahlia/ui-components/src/sections/markdown_section"
import PageContent from "../page_content/homepage.mdx"

export default props => {
  const heroTitle = (
    <>
      {t("WELCOME.TITLE")} <em>{t("REGION.NAME")}</em>
    </>
  )

  return (
    <Layout>
      <Hero
        title={heroTitle}
        buttonTitle={t("WELCOME.SEE_RENTAL_LISTINGS")}
        buttonLink="/listings"
      />
      <div className="homepage-extra">
        <MarkdownSection fullwidth={true}>
          <PageContent />
        </MarkdownSection>
      </div>
    </Layout>
  )
}
