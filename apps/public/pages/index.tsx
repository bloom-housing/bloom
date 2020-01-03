import { Component } from "react"
import Head from "next/head"
import t from "@bloom-housing/ui-components/src/helpers/translator"
import Layout from "../layouts/application"
import Hero from "@bloom-housing/ui-components/src/headers/Hero"
import MarkdownSection from "@bloom-housing/ui-components/src/sections/markdown_section"
import PageContent from "../page_content/homepage.mdx"
import { Listing } from "@bloom-housing/core/src/listings"
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
          <meta property="og:title" content={t("nav.siteTitle")} />
          <meta property="og:image" content={metaImage} />
          <meta property="og:description" content={metaDescription} />
          <meta name="description" content={metaDescription} />
          <meta property="og:type" content="website" />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:title" content={t("nav.siteTitle")} />
          <meta property="twitter:image" content={metaImage} />
          <meta property="twitter:description" content={metaDescription} />
        </Head>
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
