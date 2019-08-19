import { Component } from "react"
import ReactDOMServer from "react-dom/server"
import { unitSummariesTable } from "../lib/unit_summaries"
import Layout from "../layouts/application"
import { Listing } from "@dahlia/ui-components/src/types"
import ListingAccordion from "@dahlia/ui-components/src/page_components/ListingAccordion/ListingAccordion"
import WhatToExpect from "@dahlia/ui-components/src/page_components/listing_sidebar/what_to_expect"
import LeasingAgent from "@dahlia/ui-components/src/page_components/listing_sidebar/leasing_agent"
import ImageHeader from "@dahlia/ui-components/src/headers/image_header/image_header"
import { OneLineAddress } from "@dahlia/ui-components/src/helpers/address"
import { BasicTable } from "@dahlia/ui-components/src/tables/basic_table"
import axios from "axios"

interface ListingProps {
  listing: Listing
}

export default class extends Component<ListingProps> {
  static async getInitialProps({ query }) {
    const listing_id = query.id
    let listing = {}

    try {
      const response = await axios.get("http://localhost:3001")
      listing = response.data.listings.find(l => l.id == listing_id)
    } catch (error) {
      console.log(error)
    }

    return { listing }
  }

  render() {
    const listing = this.props.listing

    const address = {
      street_address: listing.building_street_address,
      city: listing.building_city,
      state: listing.building_state,
      zip_code: listing.building_zip_code
    }

    const oneLineAddress = <OneLineAddress address={address} />

    const googleMapsHref =
      "https://www.google.com/maps/place/" + ReactDOMServer.renderToStaticMarkup(oneLineAddress)

    const unitSummariesHeaders = {
      unit_type: "Unit Type",
      minimum_income: "Minimum Income",
      rent: "Rent",
      availability: "Availability"
    }
    const unitSummaries = unitSummariesTable(listing)

    return (
      <Layout>
        <article className="flex flex-wrap relative max-w-5xl m-auto mb-12">
          <ImageHeader
            className="w-full md:w-2/3 p-3"
            title={listing.name}
            imageUrl={listing.image_url}
            subImageContent={
              <>
                <p className="t-alt-sans uppercase">{oneLineAddress}</p>
                <p className="text-gray-700">{listing.developer}</p>
                <p className="text-xs">
                  <a href={googleMapsHref} target="_blank" aria-label="Opens in new window">
                    View on Map
                  </a>
                </p>
                <div className="mt-12 mb-6">
                  <BasicTable
                    headers={unitSummariesHeaders}
                    data={unitSummaries}
                    responsiveCollapse={true}
                  />
                </div>
              </>
            }
          />

          <div className="w-full md:w-2/3 mt-12 mb-6 px-3">
            <BasicTable
              headers={unitSummariesHeaders}
              data={unitSummaries}
              responsiveCollapse={true}
            />
          </div>

          <aside className="w-full md:absolute md:right-0 md:w-1/3">
            <section className="border border-gray-400 border-b-0 p-5">
              <p>Hello, I am a sidebar waiting for content</p>
            </section>
            <section className="border border-gray-400 border-b-0 p-5">
              <p>I can have multiple sections</p>
            </section>
            <section className="border border-gray-400 border-b-0 p-5">
              <p>Featuring helpful listing-related info</p>
            </section>
            <section className="border border-gray-400 border-b-0 p-5">
              <WhatToExpect listing={listing} />
            </section>
            <section className="border border-gray-400 p-5">
              <LeasingAgent listing={listing} />
            </section>
          </aside>

          <div className="w-full md:w-2/3">
            <ListingAccordion listing={listing} />
            <em>Listing Id: {listing.id}</em>
          </div>
        </article>
      </Layout>
    )
  }
}
