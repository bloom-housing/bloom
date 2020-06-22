import { Component } from "react"
import Head from "next/head"
import { MetaTags, t } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"

export default class extends Component {
  public render() {
    const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
    const metaImage = "" // TODO: replace with hero image

    return (
      <Layout>
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
        <div className="homepage-extra"></div>
      </Layout>
    )
  }
}
