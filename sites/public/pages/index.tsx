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
  UserContext,
} from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import axios from "axios"
import { withRouter, NextRouter } from "next/router"

interface IndexProps {
  listings: Listing[]
  router: NextRouter
}

class Index extends Component<IndexProps> {
  static contextType = UserContext
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

  componentDidMount() {
    const { token } = this.props.router.query
    const { confirmAccount, profile } = this.context
    if (token && !profile) {
      confirmAccount(token.toString())
        .then(() => {
          this.setState({
            alertMessage: t(`authentication.createAccount.accountConfirmed`),
            alertType: "success",
          })
          void this.props.router.push("/account/dashboard", undefined, { shallow: true })
          window.scrollTo(0, 0)
        })
        .catch(() => {
          this.setState({
            alertMessage: t(`authentication.signIn.errorGenericMessage`),
            alertType: "alert",
          })
        })
    }
  }

  public closeAlert = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
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
      </Layout>
    )
  }
}
export default withRouter(Index)
