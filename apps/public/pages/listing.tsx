import { Component } from "react"
import ReactDOMServer from "react-dom/server"
import { unitSummariesTable } from "../lib/unit_summaries"
import Layout from "../layouts/application"
import { Listing } from "@bloom/ui-components/src/types"
import {
  ListingDetails,
  ListingDetailItem
} from "@bloom/ui-components/src/page_components/listing/ListingDetails"
import ListSection from "@bloom/ui-components/src/sections/ListSection"
import InfoCard from "@bloom/ui-components/src/cards/InfoCard"
import WhatToExpect from "@bloom/ui-components/src/page_components/listing/listing_sidebar/WhatToExpect"
import LeasingAgent from "@bloom/ui-components/src/page_components/listing/listing_sidebar/LeasingAgent"
import ImageHeader from "@bloom/ui-components/src/headers/image_header/image_header"
import { OneLineAddress } from "@bloom/ui-components/src/helpers/address"
import { Description } from "@bloom/ui-components/src/atoms/description"
import { BasicTable } from "@bloom/ui-components/src/tables/basic_table"
import UnitTables from "@bloom/ui-components/src/page_components/unit_tables"
import axios from "axios"

interface ListingProps {
  listing: Listing
}

export default class extends Component<ListingProps> {
  public static async getInitialProps({ query }) {
    const listingId = query.id
    let listing = {}

    try {
      const response = await axios.get("http://localhost:3001")
      listing = response.data.listings.find(l => l.id == listingId)
    } catch (error) {
      console.log(error)
    }

    return { listing }
  }

  public render() {
    const listing = this.props.listing

    const address = {
      streetAddress: listing.building_street_address,
      city: listing.building_city,
      state: listing.building_state,
      zipCode: listing.building_zip_code
    }

    const oneLineAddress = <OneLineAddress address={address} />

    const googleMapsHref =
      "https://www.google.com/maps/place/" + ReactDOMServer.renderToStaticMarkup(oneLineAddress)

    const unitSummariesHeaders = {
      unitType: "Unit Type",
      minimumIncome: "Minimum Income",
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
              </>
            }
          />

          <div className="w-full md:w-2/3 mt-6 mb-6 px-3">
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
              <WhatToExpect />
            </section>
            <section className="border border-gray-400 p-5">
              <LeasingAgent listing={listing} />
            </section>
          </aside>

          <ListingDetails>
            <ListingDetailItem
              imageAlt="eligibility-notebook"
              imageSrc="/static/images/listing-eligibility.svg"
              title="Eligibility"
              subtitle="Income, occupancy, preferences, and subsidies"
            >
              <ul>
                <ListSection
                  title="Household Maximum Income"
                  subtitle="For income calculations, household size includes everyone (all ages) living in the unit."
                >
                  <>table goes here…</>
                </ListSection>
                <ListSection
                  title="Occupancy"
                  subtitle="Occupancy limits for this building differ from household size, and do not include children under 6."
                >
                  <>table goes here…</>
                </ListSection>

                <ListSection
                  title="Rental Assistance"
                  subtitle="Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be 
                    considered for this property. In the case of a valid rental subsidy, the required minimum income 
                    will be based on the portion of the rent that the tenant pays after use of the subsidy."
                />

                <ListSection
                  title="Housing Preferences"
                  subtitle="Preference holders will be given highest ranking."
                >
                  <>table goes here…</>
                </ListSection>

                <ListSection
                  title="Additional Eligibility Rules"
                  subtitle="Applicants must also qualify under the rules of the building."
                >
                  <>
                    <InfoCard title="Credit History">
                      <p className="text-sm text-gray-700">{listing.credit_history}</p>
                    </InfoCard>
                    <InfoCard title="Rental History">
                      <p className="text-sm text-gray-700">{listing.rental_history}</p>
                    </InfoCard>
                  </>
                </ListSection>
              </ul>
            </ListingDetailItem>

            <ListingDetailItem
              imageAlt="features-cards"
              imageSrc="/static/images/listing-features.svg"
              title="Features"
              subtitle="Amenities, unit details and additional fees"
            >
              <dl>
                <Description term="Neighborhood" description={listing.neighborhood} />
                <Description term="Built" description={listing.year_built} />
                <Description term="Smoking Policy" description={listing.smoking_policy} />
                <Description term="Pets Policy" description={listing.pet_policy} />
                <Description term="Property Amenities" description={listing.amenities} />
                <Description
                  term="Unit Features"
                  description={<UnitTables groupedUnits={listing.groupedUnits} />}
                />
              </dl>
            </ListingDetailItem>

            <ListingDetailItem
              imageAlt="neighborhood-buildings"
              imageSrc="/static/images/listing-neighborhood.svg"
              title="Neighborhood"
              subtitle="Location and transportation"
            >
              <p>Map goes here…</p>
            </ListingDetailItem>

            <ListingDetailItem
              imageAlt="additional-information-envelope"
              imageSrc="/static/images/listing-legal.svg"
              title="Additional Information"
              subtitle="Required documents and selection criteria"
            >
              <p className="text-sm text-gray-700">{listing.required_documents}</p>
            </ListingDetailItem>
          </ListingDetails>
        </article>
      </Layout>
    )
  }
}
