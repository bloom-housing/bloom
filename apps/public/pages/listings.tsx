import { Component } from "react"
import t from "@dahlia/ui-components/src/helpers/translator"
import Layout from "../layouts/application"
import PageHeader from "@dahlia/ui-components/src/headers/page_header/page_header"
import {
  ListingsList,
  ListingsProps
} from "@dahlia/ui-components/src/page_components/listings_list"
import axios from "axios"

export default class extends Component<ListingsProps> {
  public static async getInitialProps() {
    let listings = []

    try {
      const response = await axios.get("http://localhost:3001")
      listings = response.data.listings
    } catch (error) {
      console.log(error)
    }

    return { listings }
  }

  public render() {
    return (
      <Layout>
        <PageHeader>{t("PAGE_TITLE.RENT")}</PageHeader>
        <ListingsList listings={this.props.listings} />
      </Layout>
    )
  }
}
