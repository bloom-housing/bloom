import { Component } from "react"
import Head from "next/head"
import { Listing } from "@bloom-housing/core"
import { Hero, MarkdownSection, MetaTags, t } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import PageContent from "../page_content/homepage.mdx"
import axios from "axios"

interface IndexProps {
  listings: Listing[]
}

export default class extends Component<IndexProps> {
  public static async getInitialProps() {
    let listings = []

    try {
      const response = await axios.get(process.env.listingServiceUrl)
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

    //    const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
    const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
    const metaImage = "" // TODO: replace with hero image

    return (
      <Layout>
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
        <Hero
          title={heroTitle}
          buttonTitle={t("welcome.seeRentalListings")}
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
