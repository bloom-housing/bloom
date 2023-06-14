import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString, getDetailFieldTime, getDetailAddress } from "./helpers"
import dayjs from "dayjs"

const DetailApplicationAddress = () => {
  const listing = useContext(ListingContext)

  const postMarkDateFormat = (date: Date) => {
    return date ? dayjs(new Date(date)).format("MM/DD/YYYY") : t("t.none")
  }

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.applicationAddressTitle")}
      grid={false}
      inset
    >
      <GridSection grid={false}>
        <GridSection columns={3}>
          <FieldValue id="applicationMailingSection" label={"Can applications be mailed in?"}>
            {listing.applicationMailingAddress || listing.applicationMailingAddressType
              ? t("t.yes")
              : t("t.no")}
          </FieldValue>
          {listing.applicationMailingAddressType && (
            <FieldValue
              id="applicationMailingAddressType"
              label={"Where can applications be mailed in?"}
            >
              {t("listings.leasingAgentAddress")}
            </FieldValue>
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
          <FieldValue
            id="applicationPickupQuestion"
            label={t("listings.applicationPickupQuestion")}
          >
            {listing.applicationPickUpAddress || listing.applicationPickUpAddressType
              ? t("t.yes")
              : t("t.no")}
          </FieldValue>
          {listing.applicationPickUpAddressType && (
            <FieldValue id="applicationPickUpAddressType" label={t("listings.wherePickupQuestion")}>
              {t("listings.leasingAgentAddress")}
            </FieldValue>
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
                <FieldValue
                  id="applicationPickUpAddressOfficeHours"
                  label={t("leasingAgent.officeHours")}
                >
                  {getDetailFieldString(listing.applicationPickUpAddressOfficeHours)}
                </FieldValue>
              </GridCell>
            </GridSection>
          </>
        )}

        <hr className={"mt-4 mb-4"} />

        <GridSection columns={3}>
          <FieldValue
            id="applicationDropOffQuestion"
            label={t("listings.applicationDropOffQuestion")}
          >
            {listing.applicationDropOffAddress || listing.applicationDropOffAddressType
              ? t("t.yes")
              : t("t.no")}
          </FieldValue>
          {listing.applicationDropOffAddressType && (
            <FieldValue
              id="applicationDropOffAddressType"
              label={t("listings.whereDropOffQuestion")}
            >
              {t("listings.leasingAgentAddress")}
            </FieldValue>
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
                <FieldValue
                  id="applicationDropOffAddressOfficeHours"
                  label={t("leasingAgent.officeHours")}
                >
                  {getDetailFieldString(listing.applicationDropOffAddressOfficeHours)}
                </FieldValue>
              </GridCell>
            </GridSection>
          </>
        )}

        <hr className={"mt-4 mb-4"} />

        <GridSection columns={3}>
          <FieldValue
            id="postmarksConsideredQuestion"
            label={t("listings.postmarksConsideredQuestion")}
          >
            {listing.postmarkedApplicationsReceivedByDate ? t("t.yes") : t("t.no")}
          </FieldValue>
        </GridSection>

        {listing.postmarkedApplicationsReceivedByDate && (
          <GridSection columns={4}>
            <GridCell span={2}>
              <FieldValue
                id="postmarkedApplicationsReceivedByDate"
                label={t("listings.receivedByDate")}
                data-testid={"postmark-date"}
              >
                {postMarkDateFormat(listing.postmarkedApplicationsReceivedByDate)}
              </FieldValue>
            </GridCell>
            <GridCell span={2}>
              <FieldValue
                id="postmarkedApplicationsReceivedByDateTime"
                label={t("listings.receivedByTime")}
                data-testid={"postmark-time"}
              >
                {getDetailFieldTime(listing.postmarkedApplicationsReceivedByDate)}
              </FieldValue>
            </GridCell>
          </GridSection>
        )}

        <GridSection columns={2}>
          <FieldValue
            id="additionalApplicationSubmissionNotes"
            label={t("listings.additionalApplicationSubmissionNotes")}
          >
            {getDetailFieldString(listing.additionalApplicationSubmissionNotes)}
          </FieldValue>
        </GridSection>
      </GridSection>
    </GridSection>
  )
}

export default DetailApplicationAddress
