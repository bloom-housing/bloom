import { Component } from "react"
import t from "@bloom-housing/ui-components/src/helpers/translator"
import Layout from "../layouts/application"
import PageHeader from "@bloom-housing/ui-components/src/headers/page_header/page_header"
import ListingsList from "@bloom-housing/ui-components/src/page_components/listing/ListingsList"
import axios from "axios"
import { unitSummariesTable } from "../lib/tableSummaries"
import moment from "moment"
import { Listing } from "@bloom-housing/core/src/listings"
import ListingsGroup from "@bloom-housing/ui-components/src/page_components/listing/ListingsGroup"

export interface ListingsProps {
  openListings: Listing[]
  closedListings: Listing[]
  unitSummariesTable: any
}
export default class extends Component<ListingsProps> {
  public static async getInitialProps() {
    const openListings = []
    const closedListings = []

    try {
      const response = await axios.get(process.env.listingServiceUrl)
      for (const listing of response.data.listings as Listing[]) {
        if (moment() > moment(listing.applicationDueDate)) {
          closedListings.push(listing)
        } else {
          openListings.push(listing)
        }
      }
    } catch (error) {
      console.log(error)
    }

    return { openListings, closedListings }
  }

  public render() {
    let openListingsSection, closedListingsSection
    if (this.props.openListings.length > 0) {
      openListingsSection = (
        <ListingsList listings={this.props.openListings} unitSummariesTable={unitSummariesTable} />
      )
    } else {
      openListingsSection = (
        <div className="flex flex-row flex-wrap max-w-5xl m-auto mt-5 mb-12 text-center p-4 bg-gray-300">
          <h3 className="m-auto text-gray-800">{t("listings.noOpenListings")}</h3>
        </div>
      )
    }
    if (this.props.closedListings.length > 0) {
      closedListingsSection = (
        <ListingsGroup
          listings={this.props.closedListings}
          header={t("listings.closedListings")}
          hideButtonText={t("listings.hideClosedListings")}
          showButtonText={t("listings.showClosedListings")}
          unitSummariesTable={unitSummariesTable}
        ></ListingsGroup>
      )
    }

    return (
      <Layout>
        <PageHeader>{t("pageTitle.rent")}</PageHeader>
        {openListingsSection}
        {closedListingsSection}
      </Layout>
    )
  }
}
