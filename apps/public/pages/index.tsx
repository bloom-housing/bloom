import { Component } from "react"
import t from "@bloom/ui-components/src/helpers/translator"
import Layout from "../layouts/application"
import Hero from "@bloom/ui-components/src/headers/hero"
import MarkdownSection from "@bloom/ui-components/src/sections/markdown_section"
import PageContent from "../page_content/homepage.mdx"
import { Listing } from "@bloom/ui-components/src/types"
import axios from "axios"

const DATA_SERVICE_URL = process.env.DATA_SERVICE_URL || "http://localhost:3001"

interface IndexProps {
  listings: Listing[]
}

export default class extends Component<IndexProps> {
  public static async getInitialProps() {
    let listings = []

    try {
      const response = await axios.get(DATA_SERVICE_URL)
      listings = response.data.listings
    } catch (error) {
      console.log(error)
    }

    return { listings }
  }

  public render() {
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
          listings={this.props.listings}
        />
        <div className="homepage-extra">
          <MarkdownSection fullwidth={true}>
            <PageContent />
          </MarkdownSection>
        </div>
      </Layout>
    )
  }
}
