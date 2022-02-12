import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString, getDetailFieldTime } from "./helpers"
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
      <GridSection grid={false} subtitle={t("listings.leasingAgentAddress")}>
        <GridSection columns={3}>
          <ViewItem id="leasingAgentAddress.street" label={t("listings.streetAddressOrPOBox")}>
            {listing.leasingAgentAddress?.street}
          </ViewItem>
          <ViewItem id="leasingAgentAddress.street2" label={t("application.contact.apt")}>
            {listing.leasingAgentAddress?.street2}
          </ViewItem>
        </GridSection>
        <GridSection columns={6}>
          <GridCell span={2}>
            <ViewItem id="leasingAgentAddress.city" label={t("application.contact.city")}>
              {listing.leasingAgentAddress?.city}
            </ViewItem>
          </GridCell>
          <ViewItem id="leasingAgentAddress.state" label={t("application.contact.state")}>
            {listing.leasingAgentAddress?.state}
          </ViewItem>
          <ViewItem id="leasingAgentAddress.zipCode" label={t("application.contact.zip")}>
            {listing.leasingAgentAddress?.zipCode}
          </ViewItem>
        </GridSection>

        <hr className={"mt-4 mb-4"} />

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

        {listing.applicationMailingAddress && (
          <GridSection grid={false} subtitle={t("application.contact.mailingAddress")}>
            <GridSection columns={3}>
              <ViewItem
                id="applicationMailingAddress.street"
                label={t("listings.streetAddressOrPOBox")}
                dataTestId={"mailing-address-street"}
              >
                {listing.applicationMailingAddress?.street}
              </ViewItem>
              <ViewItem
                id="applicationMailingAddress.street2"
                label={t("application.contact.apt")}
                dataTestId={"mailing-address-street2"}
              >
                {listing.applicationMailingAddress?.street2}
              </ViewItem>
            </GridSection>
            <GridSection columns={6}>
              <GridCell span={2}>
                <ViewItem
                  id="applicationMailingAddress.city"
                  label={t("application.contact.city")}
                  dataTestId={"mailing-address-city"}
                >
                  {listing.applicationMailingAddress?.city}
                </ViewItem>
              </GridCell>
              <ViewItem
                id="applicationMailingAddress.state"
                label={t("application.contact.state")}
                dataTestId={"mailing-address-state"}
              >
                {listing.applicationMailingAddress?.state}
              </ViewItem>
              <ViewItem
                id="applicationMailingAddress.zipCode"
                label={t("application.contact.zip")}
                dataTestId={"mailing-address-zip"}
              >
                {listing.applicationMailingAddress?.zipCode}
              </ViewItem>
            </GridSection>
          </GridSection>
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
          <GridSection grid={false} subtitle={t("listings.pickupAddress")}>
            <GridSection columns={3}>
              <ViewItem
                id="applicationPickUpAddress.street"
                label={t("listings.streetAddressOrPOBox")}
              >
                {listing.applicationPickUpAddress?.street}
              </ViewItem>
              <ViewItem id="applicationPickUpAddress.street2" label={t("application.contact.apt")}>
                {listing.applicationPickUpAddress?.street2}
              </ViewItem>
            </GridSection>
            <GridSection columns={6}>
              <GridCell span={2}>
                <ViewItem id="applicationPickUpAddress.city" label={t("application.contact.city")}>
                  {listing.applicationPickUpAddress?.city}
                </ViewItem>
              </GridCell>
              <ViewItem id="applicationPickUpAddress.state" label={t("application.contact.state")}>
                {listing.applicationPickUpAddress?.state}
              </ViewItem>
              <ViewItem id="applicationPickUpAddress.zipCode" label={t("application.contact.zip")}>
                {listing.applicationPickUpAddress?.zipCode}
              </ViewItem>
            </GridSection>
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
          </GridSection>
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
          <GridSection grid={false} subtitle={t("listings.dropOffAddress")}>
            <GridSection columns={3}>
              <ViewItem
                id="applicationDropOffAddress.street"
                label={t("listings.streetAddressOrPOBox")}
              >
                {listing.applicationDropOffAddress?.street}
              </ViewItem>
              <ViewItem id="applicationDropOffAddress.street2" label={t("application.contact.apt")}>
                {listing.applicationDropOffAddress?.street2}
              </ViewItem>
            </GridSection>
            <GridSection columns={6}>
              <GridCell span={2}>
                <ViewItem id="applicationDropOffAddress.city" label={t("application.contact.city")}>
                  {listing.applicationDropOffAddress?.city}
                </ViewItem>
              </GridCell>
              <ViewItem id="applicationDropOffAddress.state" label={t("application.contact.state")}>
                {listing.applicationDropOffAddress?.state}
              </ViewItem>
              <ViewItem id="applicationDropOffAddress.zipCode" label={t("application.contact.zip")}>
                {listing.applicationDropOffAddress?.zipCode}
              </ViewItem>
            </GridSection>
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
          </GridSection>
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
          >
            {getDetailFieldString(listing.additionalApplicationSubmissionNotes)}
          </ViewItem>
        </GridSection>
      </GridSection>
    </GridSection>
  )
}

export default DetailApplicationAddress
