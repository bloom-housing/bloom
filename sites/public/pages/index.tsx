import React, { Component } from "react"
import Head from "next/head"
import { Listing } from "@bloom-housing/backend-core/types"
import {
  AlertBox,
  LinkButton,
  Hero,
  MarkdownSection,
  MetaTags,
  t,
  SiteAlert,
} from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import axios from "axios"
import { withRouter, NextRouter } from "next/router"
import { ConfirmationModal } from "../src/ConfirmationModal"

interface IndexProps {
  listings: Listing[]
  router: NextRouter
}

class Index extends Component<IndexProps> {
  state = { alertMessage: null, alertType: null }

  public static async getInitialProps() {
    let listings = []
    try {
      const response = await axios.get(process.env.listingServiceUrl)
      listings = response.data
    } catch (error) {
      console.log(error)
    }

    return { listings }
  }

  public closeAlert = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
    })
  }

  public setSiteAlertMessage = (message: string, alertType: string) => {
    this.setState({
      alertMessage: message,
      alertType: alertType,
    })
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
    const alertClasses = "flex-grow mt-6 max-w-6xl w-full"
    return (
      <Layout>
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
        <div className="flex absolute w-full flex-col items-center">
          <SiteAlert type="alert" className={alertClasses} />
          <SiteAlert type="success" className={alertClasses} timeout={30000} />
        </div>
        {this.state.alertMessage && (
          <AlertBox className="" onClose={() => this.closeAlert()} type={this.state.alertType}>
            {this.state.alertMessage}
          </AlertBox>
        )}
        <Hero
          title={heroTitle}
          buttonTitle={t("welcome.seeRentalListings")}
          buttonLink="/listings"
          listings={this.props.listings}
        />
        <div className="homepage-extra">
          <MarkdownSection fullwidth={true}>
            <>
              <p>{t("welcome.seeMoreOpportunities")}</p>
              <LinkButton href="/additional-resources">
                {t("welcome.viewAdditionalHousing")}
              </LinkButton>
            </>
          </MarkdownSection>
        </div>
        <ConfirmationModal setSiteAlertMessage={this.setSiteAlertMessage} />
      </Layout>
    )
  }
}
export default withRouter(Index)
