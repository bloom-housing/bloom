import { Component } from "react"
import Head from "next/head"
import MetaTags from "@bloom-housing/ui-components/src/atoms/MetaTags"
import t from "@bloom-housing/ui-components/src/helpers/translator"
import Layout from "../layouts/application"
import PageHeader from "@bloom-housing/ui-components/src/headers/page_header/page_header"
import ListingsList from "@bloom-housing/ui-components/src/page_components/listing/ListingsList"
import axios from "axios"
import moment from "moment"
import { Listing } from "@bloom-housing/core/src/listings"
import ListingsGroup from "@bloom-housing/ui-components/src/page_components/listing/ListingsGroup"

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
        return nowTime <= moment(listing.applicationDueDate)
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
      <div className="flex flex-row flex-wrap max-w-5xl m-auto mt-5 mb-12 text-center p-4 bg-gray-300">
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
