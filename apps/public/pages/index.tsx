import * as React from "react"
import t from "@bloom/ui-components/src/helpers/translator"
import Layout from "../layouts/application"
import Hero from "@bloom/ui-components/src/headers/hero"
import MarkdownSection from "@bloom/ui-components/src/sections/markdown_section"
import PageContent from "../page_content/homepage.mdx"

export default () => {
  const heroTitle = (
    <>
      {t("welcome.title")} <em>{t("region.name")}</em>
    </>
  )

  return (
    <Layout>
      <Hero
        title={heroTitle}
        buttonTitle={t("welcome.see_rental_listings")}
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
