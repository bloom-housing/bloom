import React, { Component } from "react"
import ReactDOMServer from "react-dom/server"
import Head from "next/head"
import axios from "axios"
import { Listing } from "@bloom-housing/core"
import {
  AdditionalFees,
  ApplicationSection,
  ApplicationStatus,
  BasicTable,
  Description,
  ExpandableText,
  GroupedTable,
  GroupedTableGroup,
  Headers,
  InfoCard,
  ImageCard,
  LeasingAgent,
  ListingDetails,
  ListingDetailItem,
  ListingMap,
  ListSection,
  MetaTags,
  OneLineAddress,
  PreferencesList,
  UnitTables,
  WhatToExpect,
  getOccupancyDescription,
  groupNonReservedAndReservedSummaries,
  occupancyTable,
  t,
} from "@bloom-housing/ui-components"
import Layout from "../layouts/application"

interface ListingProps {
  listing: Listing
}

export default class extends Component<ListingProps> {
  public static async getInitialProps({ query }) {
    const listingId = query.id
    let listing = {}

    try {
      const response = await axios.get(process.env.listingServiceUrl)
      listing = response.data.listings.find((l) => l.id == listingId)
    } catch (error) {
      console.log(error)
    }

    return { listing }
  }

  public render() {
    let buildingSelectionCriteria, preferencesSection
    const listing = this.props.listing

    const oneLineAddress = <OneLineAddress address={listing.buildingAddress} />

    const googleMapsHref =
      "https://www.google.com/maps/place/" + ReactDOMServer.renderToStaticMarkup(oneLineAddress)

    const unitSummariesHeaders = {
      unitType: t("t.unitType"),
      minimumIncome: t("t.minimumIncome"),
      rent: t("t.rent"),
      availability: t("t.availability"),
    }

    const amiValues = listing.unitsSummarized.amiPercentages
      .map((percent) => {
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
      occupancy: t("t.occupancy"),
    }
    const occupancyData = occupancyTable(listing)

    const pageTitle = `${listing.name} - ${t("nav.siteTitle")}`
    const metaDescription = t("pageDescription.listing", {
      regionName: t("region.name"),
      listingName: listing.name,
    })
    const metaImage = listing.imageUrl

    if (listing.buildingSelectionCriteria) {
      buildingSelectionCriteria = (
        <p>
          <a href={listing.buildingSelectionCriteria}>
            {t("listings.moreBuildingSelectionCriteria")}
          </a>
        </p>
      )
    }

    if (listing.preferences) {
      preferencesSection = (
        <ListSection
          title={t("listings.sections.housingPreferencesTitle")}
          subtitle={t("listings.sections.housingPreferencesSubtitle")}
        >
          <>
            <PreferencesList preferences={listing.preferences} />
            <p className="text-gray-700 text-tiny">
              {t("listings.remainingUnitsAfterPreferenceConsideration")}
            </p>
          </>
        </ListSection>
      )
    }

    return (
      <Layout>
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <MetaTags title={listing.name} image={metaImage} description={metaDescription} />

        <article className="flex flex-wrap relative max-w-5xl m-auto">
          <header className="image-card--leader">
            <ImageCard title={listing.name} imageUrl={listing.imageUrl} />
            <div className="p-3">
              <p className="font-alt-sans uppercase tracking-widest text-sm font-semibold">
                {oneLineAddress}
              </p>
              <p className="text-gray-700 text-base">{listing.developer}</p>
              <p className="text-xs">
                <a href={googleMapsHref} target="_blank" aria-label="Opens in new window">
                  {t("t.viewOnMap")}
                </a>
              </p>
            </div>
          </header>

          <div className="w-full md:w-2/3 mt-3 md:hidden bg-primary-light block text-center md:mx-3">
            <ApplicationStatus listing={listing} />
          </div>

          <div className="w-full md:w-2/3 md:mt-6 md:mb-6 md:px-3 md:pr-8">
            {amiValues.length > 1 &&
              amiValues.map((percent) => {
                const byAMI = listing.unitsSummarized.byAMI.find((item) => {
                  return parseInt(item.percent, 10) == percent
                })

                groupedUnits = groupNonReservedAndReservedSummaries(
                  byAMI.byNonReservedUnitType,
                  byAMI.byReservedType
                )

                return (
                  <>
                    <h2 className="mt-4 mb-2">
                      {t("listings.percentAMIUnit", { percent: percent })}
                    </h2>
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
              title={t("listings.sections.eligibilityTitle")}
              subtitle={t("listings.sections.eligibilitySubtitle")}
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
                  title={t("listings.sections.rentalAssistanceTitle")}
                  subtitle={t("listings.sections.rentalAssistanceSubtitle")}
                />

                {preferencesSection}

                <ListSection
                  title={t("listings.sections.additionalEligibilityTitle")}
                  subtitle={t("listings.sections.additionalEligibilitySubtitle")}
                >
                  <>
                    <InfoCard title={t("listings.creditHistory")}>
                      <ExpandableText className="text-sm text-gray-700">
                        {listing.creditHistory}
                      </ExpandableText>
                    </InfoCard>
                    <InfoCard title={t("listings.rentalHistory")}>
                      <ExpandableText className="text-sm text-gray-700">
                        {listing.rentalHistory}
                      </ExpandableText>
                    </InfoCard>
                    <InfoCard title={t("listings.criminalBackground")}>
                      <ExpandableText className="text-sm text-gray-700">
                        {listing.criminalBackground}
                      </ExpandableText>
                    </InfoCard>
                    {buildingSelectionCriteria}
                  </>
                </ListSection>
              </ul>
            </ListingDetailItem>

            <ListingDetailItem
              imageAlt="process-info"
              imageSrc="/images/listing-process.svg"
              title={t("listings.sections.processTitle")}
              subtitle={t("listings.sections.processSubtitle")}
              hideHeader={true}
              desktopClass="header-hidden"
            >
              <aside className="w-full static md:absolute md:right-0 md:w-1/3 md:top-0 sm:w-2/3 md:ml-2 h-full md:border border-gray-400 bg-white">
                <div className="hidden md:block">
                  <ApplicationStatus listing={listing} />
                  <ApplicationSection listing={listing} />
                </div>
                <WhatToExpect listing={listing} />
                <LeasingAgent listing={listing} />
              </aside>
            </ListingDetailItem>

            <ListingDetailItem
              imageAlt="features-cards"
              imageSrc="/images/listing-features.svg"
              title={t("listings.sections.featuresTitle")}
              subtitle={t("listings.sections.featuresSubtitle")}
            >
              <div className="listing-detail-panel">
                <dl className="column-definition-list">
                  <Description term={t("t.neighborhood")} description={listing.neighborhood} />
                  <Description term={t("t.built")} description={listing.yearBuilt} />
                  <Description term={t("t.smokingPolicy")} description={listing.smokingPolicy} />
                  <Description term={t("t.petsPolicy")} description={listing.petPolicy} />
                  <Description term={t("t.propertyAmenities")} description={listing.amenities} />
                  <Description term={t("t.unitAmenities")} description={listing.unitAmenities} />
                  <Description term={t("t.accessibility")} description={listing.accessibility} />
                  <Description
                    term={t("t.unitFeatures")}
                    description={
                      <UnitTables
                        units={listing.units}
                        unitSummaries={listing.unitsSummarized.byUnitType}
                        disableAccordion={listing.disableUnitsAccordion}
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
              title={t("listings.sections.neighborhoodTitle")}
              subtitle={t("listings.sections.neighborhoodSubtitle")}
              desktopClass="bg-primary-lighter"
            >
              <div className="listing-detail-panel">
                <ListingMap address={listing.buildingAddress} listing={listing} />
              </div>
            </ListingDetailItem>

            <ListingDetailItem
              imageAlt="additional-information-envelope"
              imageSrc="/images/listing-legal.svg"
              title={t("listings.sections.additionalInformationTitle")}
              subtitle={t("listings.sections.additionalInformationSubtitle")}
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
