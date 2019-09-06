import { Component } from "react"
import Layout from "../layouts/application"
import PageHeader from "@dahlia/ui-components/src/headers/page_header/page_header"
import ListingsList, {
  ListingsProps
} from "@dahlia/ui-components/src/page_components/listing/ListingsList"
import axios from "axios"

export default class extends Component<ListingsProps> {
  static async getInitialProps() {
    let listings = []

    try {
      const response = await axios.get("http://localhost:3001")
      listings = response.data.listings
    } catch (error) {
      console.log(error)
    }

    return { listings }
  }

  render() {
    return (
      <Layout>
        <PageHeader>Rent affordable housing</PageHeader>
        <ListingsList listings={this.props.listings} />
      </Layout>
    )
  }
}
