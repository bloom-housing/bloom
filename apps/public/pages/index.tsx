import * as React from "react"
import Layout from "../layouts/application"
import Hero from "@dahlia/ui-components/src/headers/hero"
import { getCurrentGroup } from "../lib/config"
import MarkdownSection from "@dahlia/ui-components/src/sections/markdown_section"
import PageContent from "../page_content/homepage.mdx"

export default props => {
  const region = getCurrentGroup()
  const heroTitle = (
    <>
      Apply for affordable housing in <em>{region}</em>
    </>
  )

  return (
    <Layout>
      <Hero title={heroTitle} buttonTitle="See Rentals" buttonLink="/listings" />
      <div className="homepage-extra">
        <MarkdownSection fullwidth={true}>
          <PageContent />
        </MarkdownSection>
      </div>
      <div className="hidden">{props.polyglot.t("WELCOME.TITLE")}</div>
    </Layout>
  )
}
