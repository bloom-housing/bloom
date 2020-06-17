import { Component } from "react"
import Head from "next/head"
import axios from "axios"
import moment from "moment"
import {
  ListingsGroup,
  ListingsList,
  MetaTags,
  PageHeader,
  openDateState,
  t,
} from "@bloom-housing/ui-components"
import { Listing } from "@bloom-housing/core"
import Layout from "../layouts/application"

export interface ListingsProps {
  openListings: Listing[]
  closedListings: Listing[]
}
export default class extends Component<ListingsProps> {
  public static async getInitialProps() {
    let openListings = []
    let closedListings = []

    try {
      const response = await axios.get(process.env.listingServiceUrl)
      const nowTime = moment()
      openListings = response.data.listings.filter((listing: Listing) => {
        return (
          openDateState(listing) ||
          nowTime <= moment(listing.applicationDueDate) ||
          listing.applicationDueDate == null
        )
      })
      closedListings = response.data.listings.filter((listing: Listing) => {
        return nowTime > moment(listing.applicationDueDate)
      })
    } catch (error) {
      console.log(error)
    }

    return { openListings, closedListings }
  }

  renderOpenListings() {
    return this.props.openListings.length > 0 ? (
      <ListingsList listings={this.props.openListings} />
    ) : (
      <div className="notice-block">
        <h3 className="m-auto text-gray-800">{t("listings.noOpenListings")}</h3>
      </div>
    )
  }

  renderClosedListings() {
    return (
      this.props.closedListings.length > 0 && (
        <ListingsGroup
          listings={this.props.closedListings}
          header={t("listings.closedListings")}
          hideButtonText={t("listings.hideClosedListings")}
          showButtonText={t("listings.showClosedListings")}
        />
      )
    )
  }

  public render() {
    const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
    const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
    const metaImage = "" // TODO: replace with hero image

    return (
      <Layout>
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
        <PageHeader>{t("pageTitle.rent")}</PageHeader>
        {this.renderOpenListings()}
        {this.renderClosedListings()}
      </Layout>
    )
  }
}
