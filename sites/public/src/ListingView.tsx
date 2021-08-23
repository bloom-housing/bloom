import React from "react"
import ReactDOMServer from "react-dom/server"
import Markdown from "markdown-to-jsx"
import { Listing, ListingEvent, ListingEventType } from "@bloom-housing/backend-core/types"
import {
  AdditionalFees,
  Description,
  GroupedTable,
  GroupedTableGroup,
  getSummariesTable,
  ImageCard,
  imageUrlFromListing,
  LeasingAgent,
  ListingDetailItem,
  ListingDetails,
  ListingMap,
  OneLineAddress,
  t,
  UnitTables,
  OpenHouseEvent,
  ListingUpdated,
  Message,
} from "@bloom-housing/ui-components"
import { ErrorPage } from "../pages/_error"
import { getGenericAddress } from "../lib/helpers"

interface ListingProps {
  listing: Listing
  preview?: boolean
}

export const ListingView = (props: ListingProps) => {
  const { listing } = props

  if (!listing) {
    return <ErrorPage />
  }

  const oneLineAddress = <OneLineAddress address={getGenericAddress(listing.buildingAddress)} />

  const googleMapsHref =
    "https://www.google.com/maps/place/" + ReactDOMServer.renderToStaticMarkup(oneLineAddress)

  const unitSummariesHeaders = {
    unitType: t("t.unitType"),
    minimumIncome: t("t.minimumIncome"),
    rent: t("t.rent"),
    availability: t("t.availability"),
    totalCount: t("t.totalCount"),
  }

  const amiValues = listing?.unitsSummarized?.amiPercentages
    ? listing.unitsSummarized.amiPercentages
        .map((percent) => {
          const percentInt = parseInt(percent, 10)
          return percentInt
        })
        .sort(function (a, b) {
          return a - b
        })
    : []

  let groupedUnits: GroupedTableGroup[] = null

  if (amiValues.length == 1) {
    groupedUnits = getSummariesTable(listing.unitsSummarized.byUnitTypeAndRent)
  } // else condition is handled inline below

  let openHouseEvents: ListingEvent[] | null = null
  if (Array.isArray(listing.events)) {
    listing.events.forEach((event) => {
      switch (event.type) {
        case ListingEventType.openHouse:
          if (!openHouseEvents) {
            openHouseEvents = []
          }
          openHouseEvents.push(event)
          break
      }
    })
  }

  const shouldShowFeaturesDetail = () => {
    return (
      listing.neighborhood ||
      listing.yearBuilt ||
      listing.smokingPolicy ||
      listing.petPolicy ||
      listing.amenities ||
      listing.unitAmenities ||
      listing.servicesOffered ||
      listing.accessibility ||
      // props for UnitTables
      (listing.units && listing.units.length > 0) ||
      listing.unitsSummarized ||
      // props for AdditionalFees
      listing.depositMin ||
      listing.depositMax ||
      listing.applicationFee ||
      listing.costsNotIncluded
    )
  }

  return (
    <article className="flex flex-wrap relative max-w-5xl m-auto">
      <header className="image-card--leader">
        <ImageCard
          title={listing.name}
          imageUrl={imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))}
          tagLabel={
            listing.reservedCommunityType
              ? t(`listings.reservedCommunityTypes.${props.listing.reservedCommunityType.name}`)
              : undefined
          }
        />
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

      <div className="w-full md:w-2/3 md:mt-6 md:mb-6 md:px-3 md:pr-8">
        {listing.reservedCommunityType && (
          <Message warning={true}>
            {t("listings.reservedFor", {
              type: t(`listings.reservedCommunityTypes.${listing.reservedCommunityType.name}`),
            })}
          </Message>
        )}
        {amiValues.length > 1 &&
          amiValues.map((percent) => {
            const byAMI = listing.unitsSummarized.byAMI.find((item) => {
              return parseInt(item.percent, 10) == percent
            })

            groupedUnits = byAMI ? getSummariesTable(byAMI.byUnitType) : []

            return (
              <>
                <h2 className="mt-4 mb-2">{t("listings.percentAMIUnit", { percent: percent })}</h2>
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
      <div className="w-full md:w-2/3 md:mt-3 md:hidden md:mx-3 border-gray-400 border-b">
        <ListingUpdated listingUpdated={listing.updatedAt} />
      </div>
      <ListingDetails>
        <ListingDetailItem
          imageAlt={t("listings.processInfo")}
          imageSrc="/images/listing-process.svg"
          title={t("listings.sections.processTitle")}
          subtitle={t("listings.sections.processSubtitle")}
          hideHeader={true}
          desktopClass="header-hidden"
        >
          <aside className="w-full static md:absolute md:right-0 md:w-1/3 md:top-0 sm:w-2/3 md:ml-2 h-full md:border border-gray-400 bg-white">
            <div className="hidden md:block">
              <ListingUpdated listingUpdated={listing.updatedAt} />
              {openHouseEvents && <OpenHouseEvent events={openHouseEvents} />}
            </div>
            {openHouseEvents && (
              <div className="mb-2 md:hidden">
                <OpenHouseEvent events={openHouseEvents} />
              </div>
            )}
            <LeasingAgent
              listing={listing}
              managementCompany={{
                name: listing.managementCompany,
                website: listing.managementWebsite,
              }}
            />
          </aside>
        </ListingDetailItem>

        <ListingDetailItem
          imageAlt={t("listings.featuresCards")}
          imageSrc="/images/listing-features.svg"
          title={t("listings.sections.featuresTitle")}
          subtitle={t("listings.sections.featuresSubtitle")}
          desktopClass="bg-primary-lighter"
        >
          {!shouldShowFeaturesDetail() ? (
            t("errors.noData")
          ) : (
            <div className="listing-detail-panel">
              <dl className="column-definition-list">
                {listing.neighborhood && (
                  <Description term={t("t.neighborhood")} description={listing.neighborhood} />
                )}
                {listing.yearBuilt && (
                  <Description term={t("t.built")} description={listing.yearBuilt} />
                )}
                {listing.smokingPolicy && (
                  <Description term={t("t.smokingPolicy")} description={listing.smokingPolicy} />
                )}
                {listing.petPolicy && (
                  <Description term={t("t.petsPolicy")} description={listing.petPolicy} />
                )}
                {listing.amenities && (
                  <Description term={t("t.propertyAmenities")} description={listing.amenities} />
                )}
                {listing.unitAmenities && (
                  <Description term={t("t.unitAmenities")} description={listing.unitAmenities} />
                )}
                {listing.servicesOffered && (
                  <Description
                    term={t("t.servicesOffered")}
                    description={listing.servicesOffered}
                  />
                )}
                {listing.accessibility && (
                  <Description term={t("t.accessibility")} description={listing.accessibility} />
                )}
                <Description
                  term={t("t.unitFeatures")}
                  description={
                    <UnitTables
                      units={listing.units}
                      unitSummaries={listing?.unitsSummarized?.byUnitType}
                      disableAccordion={listing.disableUnitsAccordion}
                    />
                  }
                />
              </dl>
              <AdditionalFees listing={listing} />
            </div>
          )}
        </ListingDetailItem>

        <ListingDetailItem
          imageAlt={t("listings.neighborhoodBuildings")}
          imageSrc="/images/listing-neighborhood.svg"
          title={t("listings.sections.neighborhoodTitle")}
          subtitle={t("listings.sections.neighborhoodSubtitle")}
        >
          <div className="listing-detail-panel">
            <ListingMap
              address={getGenericAddress(listing.buildingAddress)}
              listingName={listing.name}
            />
          </div>
        </ListingDetailItem>

        {(listing.requiredDocuments || listing.programRules || listing.specialNotes) && (
          <ListingDetailItem
            imageAlt={t("listings.additionalInformationEnvelope")}
            imageSrc="/images/listing-legal.svg"
            title={t("listings.sections.additionalInformationTitle")}
            subtitle={t("listings.sections.additionalInformationSubtitle")}
            desktopClass="bg-primary-lighter"
          >
            <div className="listing-detail-panel">
              {listing.requiredDocuments && (
                <div className="info-card">
                  <h3 className="text-serif-lg">{t("listings.requiredDocuments")}</h3>
                  <p className="text-sm text-gray-700">
                    <Markdown
                      children={listing.requiredDocuments}
                      options={{ disableParsingRawHTML: true }}
                    />
                  </p>
                </div>
              )}
              {listing.programRules && (
                <div className="info-card">
                  <h3 className="text-serif-lg">{t("listings.importantProgramRules")}</h3>
                  <p className="text-sm text-gray-700">
                    <Markdown
                      children={listing.programRules}
                      options={{ disableParsingRawHTML: true }}
                    />
                  </p>
                </div>
              )}
              {listing.specialNotes && (
                <div className="info-card">
                  <h3 className="text-serif-lg">{t("listings.specialNotes")}</h3>
                  <p className="text-sm text-gray-700">
                    <Markdown
                      children={listing.specialNotes}
                      options={{ disableParsingRawHTML: true }}
                    />
                  </p>
                </div>
              )}
            </div>
          </ListingDetailItem>
        )}
      </ListingDetails>
    </article>
  )
}
