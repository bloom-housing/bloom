import React, { Component } from "react"
import ReactDOMServer from "react-dom/server"
import Head from "next/head"
import MetaTags from "@bloom-housing/ui-components/src/atoms/MetaTags"
import t from "@bloom-housing/ui-components/src/helpers/translator"
import {
  occupancyTable,
  getOccupancyDescription
} from "@bloom-housing/ui-components/src/helpers/occupancyFormatting"
import { groupNonReservedAndReservedSummaries } from "@bloom-housing/ui-components/src/helpers/tableSummaries"
import Layout from "../layouts/application"
import { Listing } from "@bloom-housing/core/src/listings"
import {
  ListingDetails,
  ListingDetailItem
} from "@bloom-housing/ui-components/src/page_components/listing/ListingDetails"
import ListSection from "@bloom-housing/ui-components/src/sections/ListSection"
import InfoCard from "@bloom-housing/ui-components/src/cards/InfoCard"
import ApplicationDeadline from "@bloom-housing/ui-components/src/page_components/listing/listing_sidebar/ApplicationDeadline"
import ApplicationSection from "@bloom-housing/ui-components/src/page_components/listing/listing_sidebar/ApplicationSection"
import WhatToExpect from "@bloom-housing/ui-components/src/page_components/listing/listing_sidebar/WhatToExpect"
import LeasingAgent from "@bloom-housing/ui-components/src/page_components/listing/listing_sidebar/LeasingAgent"
import ListingMap from "@bloom-housing/ui-components/src/page_components/listing/ListingMap"
import ImageHeader from "@bloom-housing/ui-components/src/headers/image_header/image_header"
import { OneLineAddress } from "@bloom-housing/ui-components/src/helpers/address"
import { Description } from "@bloom-housing/ui-components/src/atoms/description"
import { Headers, BasicTable } from "@bloom-housing/ui-components/src/tables/BasicTable"
import {
  GroupedTable,
  GroupedTableGroup
} from "@bloom-housing/ui-components/src/tables/GroupedTable"
import UnitTables from "@bloom-housing/ui-components/src/page_components/UnitTables"
import AdditionalFees from "@bloom-housing/ui-components/src/page_components/listing/AdditionalFees"
import PreferencesList from "@bloom-housing/ui-components/src/lists/PreferencesList"
import axios from "axios"

interface ListingProps {
  listing: Listing
}

export default class extends Component<ListingProps> {
  public static async getInitialProps({ query }) {
    const listingId = query.id
    let listing = {}

    try {
      const response = await axios.get(process.env.listingServiceUrl)
      listing = response.data.listings.find(l => l.id == listingId)
    } catch (error) {
      console.log(error)
    }

    return { listing }
  }

  public render() {
    const listing = this.props.listing

    const oneLineAddress = <OneLineAddress address={listing.buildingAddress} />

    const googleMapsHref =
      "https://www.google.com/maps/place/" + ReactDOMServer.renderToStaticMarkup(oneLineAddress)

    const unitSummariesHeaders = {
      unitType: "Unit Type",
      minimumIncome: "Minimum Income",
      rent: "Rent",
      availability: "Availability"
    }

    const amiValues = listing.unitsSummarized.amiPercentages
      .map(percent => {
        const percentInt = parseInt(percent, 10)
        return percentInt
      })
      .sort()
    const hmiHeaders = listing.unitsSummarized.hmi.columns as Headers
    const hmiData = listing.unitsSummarized.hmi.rows
    let groupedUnits: GroupedTableGroup[] = null

    if (amiValues.length == 1) {
      groupedUnits = groupNonReservedAndReservedSummaries(
        listing.unitsSummarized.byNonReservedUnitType,
        listing.unitsSummarized.byReservedType
      )
    } // else condition is handled inline below

    const occupancyDescription = getOccupancyDescription(listing)
    const occupancyHeaders = {
      unitType: t("t.unitType"),
      occupancy: t("t.occupancy")
    }
    const occupancyData = occupancyTable(listing)

    const pageTitle = `${listing.name} - ${t("nav.siteTitle")}`
    const metaDescription = t("pageDescription.listing", {
      regionName: t("region.name"),
      listingName: listing.name
    })
    const metaImage = listing.imageUrl

    return (
      <Layout>
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <MetaTags title={listing.name} image={metaImage} description={metaDescription} />
        <article className="image-card--leader flex flex-wrap relative max-w-5xl m-auto">
          <ImageHeader
            className="w-full md:w-2/3 pt-8 md:pr-8"
            title={listing.name}
            imageUrl={listing.imageUrl}
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
            <ApplicationDeadline date={listing.applicationDueDate} />
          </div>

          <div className="w-full md:w-2/3 md:mt-6 md:mb-6 md:px-3 md:pr-8">
            {amiValues.length > 1 &&
              amiValues.map(percent => {
                const byAMI = listing.unitsSummarized.byAMI.find(item => {
                  return parseInt(item.percent, 10) == percent
                })

                groupedUnits = groupNonReservedAndReservedSummaries(
                  byAMI.byNonReservedUnitType,
                  byAMI.byReservedType
                )

                return (
                  <>
                    <h2 className="mt-4 mb-2">{percent}% AMI Unit</h2>
                    <GroupedTable
                      headers={unitSummariesHeaders}
                      data={groupedUnits}
                      responsiveCollapse={true}
                    />
                  </>
                )
              })}
            {amiValues.length == 1 && (
              <GroupedTable
                headers={unitSummariesHeaders}
                data={groupedUnits}
                responsiveCollapse={true}
              />
            )}
          </div>
          <div className="w-full md:w-2/3 md:mt-3 md:hidden md:mx-3">
            <ApplicationSection listing={listing} />
          </div>
          <ListingDetails>
            <ListingDetailItem
              imageAlt="eligibility-notebook"
              imageSrc="/images/listing-eligibility.svg"
              title="Eligibility"
              subtitle="Income, occupancy, preferences, and subsidies"
              desktopClass="bg-primary-lighter"
            >
              <ul>
                <ListSection
                  title={t("listings.householdMaximumIncome")}
                  subtitle={t("listings.forIncomeCalculations")}
                >
                  <BasicTable headers={hmiHeaders} data={hmiData} responsiveCollapse={true} />
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
                  <>
                    <PreferencesList preferences={listing.preferences} />
                    <p className="text-gray-700 text-tiny">
                      {t("listings.remainingUnitsAfterPreferenceConsideration")}
                    </p>
                  </>
                </ListSection>

                <ListSection
                  title={t("listings.additionalEligibility.title")}
                  subtitle={t("listings.additionalEligibility.subtitle")}
                >
                  <>
                    <InfoCard title={t("listings.creditHistory")}>
                      <p className="text-sm text-gray-700">{listing.creditHistory}</p>
                    </InfoCard>
                    <InfoCard title={t("listings.rentalHistory")}>
                      <p className="text-sm text-gray-700">{listing.rentalHistory}</p>
                    </InfoCard>
                    <InfoCard title={t("listings.criminalBackground")}>
                      <p className="text-sm text-gray-700">{listing.criminalBackground}</p>
                    </InfoCard>
                  </>
                </ListSection>
              </ul>
            </ListingDetailItem>

            <ListingDetailItem
              imageAlt="process-info"
              imageSrc="/images/listing-process.svg"
              title="Process"
              subtitle="Important dates and contact information"
              hideHeader={true}
              desktopClass="header-hidden"
            >
              <aside className="w-full static md:absolute md:right-0 md:w-1/3 md:top-0 sm:w-2/3 mb-5 md:ml-2 h-full md:border border-gray-400 bg-white">
                <div className="hidden md:block">
                  <section className="border-gray-400 border-b p-5 bg-primary-light">
                    <ApplicationDeadline date={listing.applicationDueDate} />
                  </section>
                  <ApplicationSection listing={listing} />
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
              imageSrc="/images/listing-features.svg"
              title="Features"
              subtitle="Amenities, unit details and additional fees"
            >
              <div className="listing-detail-panel">
                <dl className="column-definition-list">
                  <Description term="Neighborhood" description={listing.neighborhood} />
                  <Description term="Built" description={listing.yearBuilt} />
                  <Description term="Smoking Policy" description={listing.smokingPolicy} />
                  <Description term="Pets Policy" description={listing.petPolicy} />
                  <Description term="Property Amenities" description={listing.amenities} />
                  <Description term="Unit Amenities" description={listing.unitAmenities} />
                  <Description term="Accessibility" description={listing.accessibility} />
                  <Description
                    term="Unit Features"
                    description={
                      <UnitTables
                        units={listing.units}
                        unitSummaries={listing.unitsSummarized.byUnitType}
                      />
                    }
                  />
                </dl>
                <AdditionalFees listing={listing} />
              </div>
            </ListingDetailItem>

            <ListingDetailItem
              imageAlt="neighborhood-buildings"
              imageSrc="/images/listing-neighborhood.svg"
              title="Neighborhood"
              subtitle="Location and transportation"
              desktopClass="bg-primary-lighter"
            >
              <div className="listing-detail-panel">
                <ListingMap address={listing.buildingAddress} listing={listing} />
              </div>
            </ListingDetailItem>

            <ListingDetailItem
              imageAlt="additional-information-envelope"
              imageSrc="/images/listing-legal.svg"
              title="Additional Information"
              subtitle="Required documents and selection criteria"
            >
              <div className="listing-detail-panel">
                <div className="info-card">
                  <h3 className="text-serif-lg">{t("listings.requiredDocuments")}</h3>
                  <p className="text-sm text-gray-700">{listing.requiredDocuments}</p>
                </div>
                {listing.programRules && (
                  <div className="info-card">
                    <h3 className="text-serif-lg">{t("listings.importantProgramRules")}</h3>
                    <p className="text-sm text-gray-700">{listing.programRules}</p>
                  </div>
                )}
              </div>
            </ListingDetailItem>
          </ListingDetails>
        </article>
      </Layout>
    )
  }
}
