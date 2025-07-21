import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Markdown from "markdown-to-jsx"
import {
  FeatureFlagEnum,
  Jurisdiction,
  Listing,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  User,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import {
  AuthContext,
  MessageContext,
  pdfUrlFromListingEvents,
  ResponseException,
} from "@bloom-housing/shared-helpers"
import { Card, Heading } from "@bloom-housing/ui-seeds"
import { ErrorPage } from "../../pages/_error"
import { fetchFavoriteListingIds, isFeatureFlagOn, saveListingFavorite } from "../../lib/helpers"
import {
  getAdditionalInformation,
  getAmiValues,
  getDateString,
  getEligibilitySections,
  getFeatures,
  getPaperApplications,
  getUtilitiesIncluded,
  PaperApplicationDialog,
} from "./ListingViewSeedsHelpers"
import { AdditionalFees } from "./listing_sections/AdditionalFees"
import { AdditionalInformation } from "./listing_sections/AdditionalInformation"
import { Apply } from "./listing_sections/Apply"
import { Availability } from "./listing_sections/Availability"
import { DateSection } from "./listing_sections/DateSection"
import { Eligibility } from "./listing_sections/Eligibility"
import { Features } from "./listing_sections/Features"
import { FurtherInformation } from "./listing_sections/FurtherInformation"
import { InfoCard } from "./listing_sections/InfoCard"
import { LeasingAgent } from "./listing_sections/LeasingAgent"
import { LotteryResults } from "./listing_sections/LotteryResults"
import { MainDetails } from "./listing_sections/MainDetails"
import { Neighborhood } from "./listing_sections/Neighborhood"
import { RentSummary } from "./listing_sections/RentSummary"
import { UnitSummaries } from "./listing_sections/UnitSummaries"
import styles from "./ListingViewSeeds.module.scss"

interface ListingProps {
  listing: Listing
  jurisdiction?: Jurisdiction
  profile?: User
  preview?: boolean
}

export const ListingViewSeeds = ({ listing, jurisdiction, profile, preview }: ListingProps) => {
  const { userService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = useForm()

  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [listingFavorited, setListingFavorited] = useState(false)

  useEffect(() => {
    if (profile) {
      void fetchFavoriteListingIds(profile.id, userService).then((listingIds) => {
        setListingFavorited(listingIds.includes(listing?.id))
      })
    }
  }, [profile, setListingFavorited, userService, listing?.id])

  if (!listing) {
    return <ErrorPage />
  }

  const saveFavorite = (favorited) => {
    saveListingFavorite(userService, listing.id, favorited)
      .then(() => {
        setListingFavorited(favorited)
      })
      .catch((err) => {
        if (err instanceof ResponseException) {
          addToast(err.message, { variant: "alert" })
        } else {
          // Unknown exception
          console.error(err)
        }
      })
  }

  const lotteryResultsEvent = listing.listingEvents?.find(
    (event) => event.type === ListingEventsTypeEnum.lotteryResults
  )
  const paperApplications = getPaperApplications(listing.applicationMethods)
  const paperApplicationURL: string = watch(
    "paperApplicationLanguage",
    paperApplications?.length ? paperApplications[0].fileURL : undefined
  )

  const OpenHouses = (
    <DateSection
      heading={t("listings.openHouseEvent.header")}
      events={listing.listingEvents?.filter(
        (event) => event.type === ListingEventsTypeEnum.openHouse
      )}
    />
  )

  const LotteryEvent = (
    <>
      {(!lotteryResultsEvent || listing.status === ListingsStatusEnum.active) && (
        <DateSection
          heading={t("listings.publicLottery.header")}
          events={listing.listingEvents?.filter(
            (event) => event.type === ListingEventsTypeEnum.publicLottery
          )}
        />
      )}
    </>
  )

  const ReferralApplication = (
    <>
      {listing.referralApplication && (
        <FurtherInformation
          instructions={listing.referralApplication.externalReference}
          phoneNumber={listing.referralApplication.phoneNumber}
        />
      )}
    </>
  )

  const WhatToExpect = (
    <>
      {listing.whatToExpect && (
        <InfoCard heading={t("whatToExpect.label")}>
          <Markdown className={"bloom-markdown"}>{listing.whatToExpect}</Markdown>
        </InfoCard>
      )}
    </>
  )

  const UnitFeatures = (
    <>
      <Heading size={"lg"} className={"seeds-m-be-header"} priority={3}>
        {t("t.unitFeatures")}
      </Heading>
      <UnitSummaries
        disableUnitsAccordion={listing.disableUnitsAccordion}
        units={listing.units}
        unitSummary={listing.unitsSummarized?.byUnitType}
      />
      <AdditionalFees
        applicationFee={listing.applicationFee}
        costsNotIncluded={listing.costsNotIncluded}
        depositHelperText={listing.depositHelperText}
        depositMax={listing.depositMax}
        depositMin={listing.depositMin}
        utilitiesIncluded={
          isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableUtilitiesIncluded)
            ? getUtilitiesIncluded(listing)
            : []
        }
      />
    </>
  )

  const ListingUpdatedAt = (
    <>
      {isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableListingUpdatedAt) &&
        listing.contentUpdatedAt && (
          <Card
            className={`${styles["mobile-full-width-card"]} ${styles["mobile-no-bottom-border"]}`}
          >
            <Card.Section>
              <p>
                {t("listings.listingUpdated")}:{" "}
                {getDateString(listing.contentUpdatedAt, "MMM DD, YYYY")}
              </p>
            </Card.Section>
          </Card>
        )}
    </>
  )

  const ApplyBar = (
    <>
      <LotteryResults
        listingStatus={listing.status}
        lotteryResultsPdfUrl={pdfUrlFromListingEvents(
          [lotteryResultsEvent],
          ListingEventsTypeEnum.lotteryResults
        )}
        lotteryResultsEvent={lotteryResultsEvent}
      />
      <Apply listing={listing} preview={preview} setShowDownloadModal={setShowDownloadModal} />
      {OpenHouses}
      {LotteryEvent}
      {ReferralApplication}
      {WhatToExpect}
      <LeasingAgent
        address={listing.listingsLeasingAgentAddress}
        email={listing.leasingAgentEmail}
        name={listing.leasingAgentName}
        officeHours={listing.leasingAgentOfficeHours}
        phone={listing.leasingAgentPhone}
        title={listing.leasingAgentTitle}
        managementWebsite={
          isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableCompanyWebsite)
            ? listing.managementWebsite
            : undefined
        }
      />
      {ListingUpdatedAt}
    </>
  )

  return (
    <article className={`${styles["listing-view"]} styled-stacked-table`}>
      <div className={styles["content-wrapper"]}>
        <div className={styles["left-bar"]}>
          <MainDetails
            listing={listing}
            jurisdiction={jurisdiction}
            showFavoriteButton={
              profile && isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableListingFavoriting)
            }
            listingFavorited={listingFavorited}
            setListingFavorited={saveFavorite}
            showHomeType={isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableHomeType)}
          />
          <RentSummary
            amiValues={getAmiValues(listing)}
            reviewOrderType={listing.reviewOrderType}
            unitsSummarized={listing.unitsSummarized}
            section8Acceptance={listing.section8Acceptance}
            listing={listing}
          />
          <div className={styles["main-content"]}>
            <div className={styles["hide-desktop"]}>{ApplyBar}</div>
            <Eligibility eligibilitySections={getEligibilitySections(jurisdiction, listing)} />
            <Features features={getFeatures(listing, jurisdiction)}>{UnitFeatures}</Features>
            <Neighborhood
              address={listing.listingsBuildingAddress}
              name={listing.name}
              neighborhoodAmenities={
                isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableNeighborhoodAmenities)
                  ? listing.listingNeighborhoodAmenities
                  : null
              }
              neighborhood={listing.neighborhood}
              region={
                isFeatureFlagOn(jurisdiction, FeatureFlagEnum.enableRegions)
                  ? listing.region?.toString().replace("_", " ")
                  : null
              }
            />
            <AdditionalInformation additionalInformation={getAdditionalInformation(listing)} />
          </div>
        </div>
        <div className={`${styles["right-bar"]} ${styles["hide-mobile"]}`}>
          <Availability listing={listing} jurisdiction={jurisdiction} />
          {ApplyBar}
        </div>
      </div>
      <PaperApplicationDialog
        listingName={listing.name}
        paperApplications={paperApplications}
        paperApplicationUrl={paperApplicationURL}
        register={register}
        setShowDialog={setShowDownloadModal}
        showDialog={showDownloadModal}
      />
    </article>
  )
}
