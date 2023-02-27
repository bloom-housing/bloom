import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { ViewItem } from "../../../../../../../detroit-ui-components/src/blocks/ViewItem"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString, getDetailFieldTime, getDetailAddress } from "./helpers"
import dayjs from "dayjs"

const DetailApplicationAddress = () => {
  const listing = useContext(ListingContext)

  const postMarkDateFormat = (date: Date) => {
    return date ? dayjs(new Date(date)).format("MM/DD/YYYY") : t("t.none")
  }

  if (!listing.leasingAgentAddress) return <></>

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.applicationAddressTitle")}
      grid={false}
      inset
    >
      <GridSection grid={false}>
        <GridSection columns={3}>
          <ViewItem id="applicationMailingSection" label={"Can applications be mailed in?"}>
            {listing.applicationMailingAddress || listing.applicationMailingAddressType
              ? t("t.yes")
              : t("t.no")}
          </ViewItem>
          {listing.applicationMailingAddressType && (
            <ViewItem
              id="applicationMailingAddressType"
              label={"Where can applications be mailed in?"}
            >
              {t("listings.leasingAgentAddress")}
            </ViewItem>
          )}
        </GridSection>

        {listing.applicationMailingAddress &&
          getDetailAddress(
            listing.applicationMailingAddress,
            "applicationMailingAddress",
            t("application.contact.mailingAddress")
          )}

        <hr className={"mt-4 mb-4"} />

        <GridSection columns={3}>
          <ViewItem id="applicationPickupQuestion" label={t("listings.applicationPickupQuestion")}>
            {listing.applicationPickUpAddress || listing.applicationPickUpAddressType
              ? t("t.yes")
              : t("t.no")}
          </ViewItem>
          {listing.applicationPickUpAddressType && (
            <ViewItem id="applicationPickUpAddressType" label={t("listings.wherePickupQuestion")}>
              {t("listings.leasingAgentAddress")}
            </ViewItem>
          )}
        </GridSection>

        {listing.applicationPickUpAddress && (
          <>
            {getDetailAddress(
              listing.applicationPickUpAddress,
              "applicationPickUpAddress",
              t("listings.pickupAddress")
            )}
            <GridSection columns={3}>
              <GridCell span={2}>
                <ViewItem
                  id="applicationPickUpAddressOfficeHours"
                  label={t("leasingAgent.officeHours")}
                >
                  {getDetailFieldString(listing.applicationPickUpAddressOfficeHours)}
                </ViewItem>
              </GridCell>
            </GridSection>
          </>
        )}

        <hr className={"mt-4 mb-4"} />

        <GridSection columns={3}>
          <ViewItem
            id="applicationDropOffQuestion"
            label={t("listings.applicationDropOffQuestion")}
          >
            {listing.applicationDropOffAddress || listing.applicationDropOffAddressType
              ? t("t.yes")
              : t("t.no")}
          </ViewItem>
          {listing.applicationDropOffAddressType && (
            <ViewItem id="applicationDropOffAddressType" label={t("listings.whereDropOffQuestion")}>
              {t("listings.leasingAgentAddress")}
            </ViewItem>
          )}
        </GridSection>

        {listing.applicationDropOffAddress && (
          <>
            {getDetailAddress(
              listing.applicationDropOffAddress,
              "applicationDropOffAddress",
              t("listings.dropOffAddress")
            )}
            <GridSection columns={3}>
              <GridCell span={2}>
                <ViewItem
                  id="applicationDropOffAddressOfficeHours"
                  label={t("leasingAgent.officeHours")}
                >
                  {getDetailFieldString(listing.applicationDropOffAddressOfficeHours)}
                </ViewItem>
              </GridCell>
            </GridSection>
          </>
        )}

        <hr className={"mt-4 mb-4"} />

        <GridSection columns={3}>
          <ViewItem
            id="postmarksConsideredQuestion"
            label={t("listings.postmarksConsideredQuestion")}
          >
            {listing.postmarkedApplicationsReceivedByDate ? t("t.yes") : t("t.no")}
          </ViewItem>
        </GridSection>

        {listing.postmarkedApplicationsReceivedByDate && (
          <GridSection columns={4}>
            <GridCell span={2}>
              <ViewItem
                id="postmarkedApplicationsReceivedByDate"
                label={t("listings.receivedByDate")}
                dataTestId={"postmark-date"}
              >
                {postMarkDateFormat(listing.postmarkedApplicationsReceivedByDate)}
              </ViewItem>
            </GridCell>
            <GridCell span={2}>
              <ViewItem
                id="postmarkedApplicationsReceivedByDateTime"
                label={t("listings.receivedByTime")}
                dataTestId={"postmark-time"}
              >
                {getDetailFieldTime(listing.postmarkedApplicationsReceivedByDate)}
              </ViewItem>
            </GridCell>
          </GridSection>
        )}

        <GridSection columns={2}>
          <ViewItem
            id="additionalApplicationSubmissionNotes"
            label={t("listings.additionalApplicationSubmissionNotes")}
            dataTestId="additionalApplicationSubmissionNotes"
          >
            {getDetailFieldString(listing.additionalApplicationSubmissionNotes)}
          </ViewItem>
        </GridSection>
      </GridSection>
    </GridSection>
  )
}

export default DetailApplicationAddress
