import { Component } from "react"
import ReactDOMServer from "react-dom/server"
import t from "@bloom/ui-components/src/helpers/translator"
import { unitSummariesTable, occupancyTable } from "../lib/tableSummaries"
import getOccupancyDescription from "../lib/getOccupancyDescription"
import Layout from "../layouts/application"
import { Listing } from "@bloom/ui-components/src/types"
import {
  ListingDetails,
  ListingDetailItem
} from "@bloom/ui-components/src/page_components/listing/ListingDetails"
import ListSection from "@bloom/ui-components/src/sections/ListSection"
import InfoCard from "@bloom/ui-components/src/cards/InfoCard"
import ApplicationDeadline from "@bloom/ui-components/src/page_components/listing/listing_sidebar/ApplicationDeadline"
import ApplicationSection from "@bloom/ui-components/src/page_components/listing/listing_sidebar/ApplicationSection"
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

    const occupancyDescription = getOccupancyDescription(listing)
    const occupancyHeaders = {
      unitType: t("t.unit_type"),
      occupancy: t("t.occupancy")
    }
    const occupancyData = occupancyTable(listing)

    return (
      <Layout>
        <article className="image-card--leader flex flex-wrap relative max-w-5xl m-auto">
          <ImageHeader
            className="w-full md:w-2/3 pt-8 md:pr-8"
            title={listing.name}
            imageUrl={listing.image_url}
            subImageContent={
              <>
                <p className="font-alt-sans uppercase tracking-widest text-sm font-semibold">
                  {oneLineAddress}
                </p>
                <p className="text-gray-700 text-base">{listing.developer}</p>
                <p className="text-xs">
                  <a href={googleMapsHref} target="_blank" aria-label="Opens in new window">
                    View on Map
                  </a>
                </p>
              </>
            }
          />
          <div className="w-full md:w-2/3 mt-3 md:hidden bg-primary-light px-3 p-5 block text-center md:mx-3">
            <ApplicationDeadline date={listing.application_due_date} />
          </div>

          <div className="w-full md:w-2/3 md:mt-6 md:mb-6 md:px-3 md:pr-8">
            <BasicTable
              headers={unitSummariesHeaders}
              data={unitSummaries}
              responsiveCollapse={true}
            />
          </div>
          <div className="w-full md:w-2/3 md:mt-3 md:hidden md:mx-3">
            <ApplicationSection listing={listing} />
          </div>
          <ListingDetails>
            <ListingDetailItem
              imageAlt="eligibility-notebook"
              imageSrc="/static/images/listing-eligibility.svg"
              title="Eligibility"
              subtitle="Income, occupancy, preferences, and subsidies"
            >
              <ul>
                <ListSection
                  title={t("listings.household_maximum_income")}
                  subtitle={t("listings.for_income_calculations")}
                >
                  <>table goes here…</>
                </ListSection>

                <ListSection title={t("t.occupancy")} subtitle={occupancyDescription}>
                  <BasicTable
                    headers={occupancyHeaders}
                    data={occupancyData}
                    responsiveCollapse={false}
                  />
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
              imageAlt="process-info"
              imageSrc="/static/images/listing-process.svg"
              title="Process"
              subtitle="Important dates and contact information"
            >
              <aside className="w-full static md:absolute md:right-0 md:w-1/3 md:top-0 sm:w-2/3 mb-5 md:ml-2 h-full md:border border-gray-400 bg-white">
                <div className="hidden md:block">
                  <section className="border-gray-400 border-b p-5 bg-primary-light">
                    <ApplicationDeadline date={listing.application_due_date} />
                  </section>
                </div>
                <section className="border-b border-gray-400 py-3 my-2 md:py-5 md:my-0 md:px-5 mx-5 md:mx-0">
                  <WhatToExpect />
                </section>
                <section className="border-b border-gray-400 py-3 my-2 md:py-5 md:my-0 md:px-5 mx-5 md:mx-0">
                  <LeasingAgent listing={listing} />
                </section>
              </aside>
            </ListingDetailItem>

            <ListingDetailItem
              imageAlt="features-cards"
              imageSrc="/static/images/listing-features.svg"
              title="Features"
              subtitle="Amenities, unit details and additional fees"
            >
              <div className="listing-detail-panel">
                <dl className="column-definition-list">
                  <Description term="Neighborhood" description={listing.neighborhood} />
                  <Description term="Built" description={listing.year_built} />
                  <Description term="Smoking Policy" description={listing.smoking_policy} />
                  <Description term="Pets Policy" description={listing.pet_policy} />
                  <Description term="Property Amenities" description={listing.amenities} />
                  <Description
                    term="Unit Features"
                    description={<UnitTables groupedUnits={listing.unitsSummarized.grouped} />}
                  />
                </dl>
              </div>
            </ListingDetailItem>

            <ListingDetailItem
              imageAlt="neighborhood-buildings"
              imageSrc="/static/images/listing-neighborhood.svg"
              title="Neighborhood"
              subtitle="Location and transportation"
            >
              <div className="listing-detail-panel">
                <p>Map goes here…</p>
              </div>
            </ListingDetailItem>

            <ListingDetailItem
              imageAlt="additional-information-envelope"
              imageSrc="/static/images/listing-legal.svg"
              title="Additional Information"
              subtitle="Required documents and selection criteria"
            >
              <div className="listing-detail-panel">
                <div className="info-card">
                  <p className="text-sm text-gray-700">{listing.required_documents}</p>
                </div>
              </div>
            </ListingDetailItem>
          </ListingDetails>
        </article>
      </Layout>
    )
  }
}
