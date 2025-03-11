import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  FeatureFlagEnum,
  Jurisdiction,
  Listing,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  ModificationEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import { AuthContext, pdfUrlFromListingEvents } from "@bloom-housing/shared-helpers"
import { Heading } from "@bloom-housing/ui-seeds"
import { ErrorPage } from "../../pages/_error"
import { getListingApplicationStatus, isFeatureFlagOn } from "../../lib/helpers"
import {
  getAdditionalInformation,
  getAmiValues,
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
import { useProfileFavoriteListings } from "../../lib/hooks"

interface ListingProps {
  jurisdiction?: Jurisdiction
  listing: Listing
  preview?: boolean
}

export const ListingViewSeeds = ({ jurisdiction, listing, preview }: ListingProps) => {
  const { userService } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = useForm()

  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [listingFavorited, setListingFavorited] = useState(false)
  const favoriteListings = useProfileFavoriteListings()

  useEffect(() => {
    setListingFavorited(favoriteListings.some((item) => item.id === listing?.id))
  }, [setListingFavorited, favoriteListings, listing?.id])

  if (!listing) {
    return <ErrorPage />
  }

  // Code for setting/unsetting favorite status for the listing
  const updateFavorite = async (nowFavorited) => {
    setListingFavorited(nowFavorited)
    await userService.modifyFavoriteListings({
      body: {
        id: listing.id,
        action: nowFavorited ? ModificationEnum.add : ModificationEnum.remove,
      },
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
  const statusContent = getListingApplicationStatus(listing)

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
          <div>{listing.whatToExpect}</div>
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

  const ApplyBar = (
    <>
      <LotteryResults
        listingStatus={listing.status}
        lotteryResultsPdfUrl={pdfUrlFromListingEvents(
          [lotteryResultsEvent],
          ListingEventsTypeEnum.lotteryResults,
          process.env.cloudinaryCloudName
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
      />
    </>
  )

  return (
    <article className={`${styles["listing-view"]} styled-stacked-table`}>
      <div className={styles["content-wrapper"]}>
        <div className={styles["left-bar"]}>
          <MainDetails
            listing={listing}
            dueDateContent={[statusContent?.content, statusContent?.subContent]}
            jurisdiction={jurisdiction}
            showFavoriteButton={isFeatureFlagOn(
              jurisdiction,
              FeatureFlagEnum.enableListingFavoriting
            )}
            listingFavorited={listingFavorited}
            setListingFavorited={updateFavorite}
          />
          <RentSummary
            amiValues={getAmiValues(listing)}
            reviewOrderType={listing.reviewOrderType}
            unitsSummarized={listing.unitsSummarized}
            section8Acceptance={listing.section8Acceptance}
          />
          <div className={styles["main-content"]}>
            <div className={styles["hide-desktop"]}>{ApplyBar}</div>
            <Eligibility
              eligibilitySections={getEligibilitySections(listing)}
              section8Acceptance={listing.section8Acceptance}
            />
            <Features features={getFeatures(listing, jurisdiction)}>{UnitFeatures}</Features>
            <Neighborhood address={listing.listingsBuildingAddress} name={listing.name} />
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
