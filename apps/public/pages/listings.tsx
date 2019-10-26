import { Component } from "react"
import t from "@bloom/ui-components/src/helpers/translator"
import Layout from "../layouts/application"
import PageHeader from "@bloom/ui-components/src/headers/page_header/page_header"
import ListingsList, {
  ListingsProps
} from "@bloom/ui-components/src/page_components/listing/ListingsList"
import axios from "axios"
import { unitSummariesTable } from "../lib/tableSummaries"

export default class extends Component<ListingsProps> {
  public static async getInitialProps() {
    let listings = []

    try {
      const response = await axios.get(process.env.dataServiceUrl)
      listings = response.data.listings
    } catch (error) {
      console.log(error)
    }

    return { listings }
  }

  public render() {
    return (
      <Layout>
        <PageHeader>{t("page_title.rent")}</PageHeader>
        <ListingsList listings={this.props.listings} unitSummariesTable={unitSummariesTable} />
      </Layout>
    )
  }
}
