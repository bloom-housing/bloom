import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { ListingApplicationAddressType } from "@bloom-housing/backend-core/types"
import { getDetailFieldString } from "./helpers"

const DetailApplicationAddress = () => {
  const listing = useContext(ListingContext)

  const getAddressString = (addressType: ListingApplicationAddressType): string | undefined => {
    if (addressType === ListingApplicationAddressType.leasingAgent)
      return t("listings.leasingAgentAddress")
    if (addressType === ListingApplicationAddressType.mailingAddress)
      return t("application.contact.mailingAddress")
  }

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.applicationAddressTitle")}
      grid={false}
      inset
    >
      <GridSection grid={false} subtitle={t("listings.leasingAgentAddress")}>
        <GridSection columns={3}>
          <ViewItem label={t("listings.streetAddressOrPOBox")}>
            {listing.leasingAgentAddress?.street}
          </ViewItem>
          <ViewItem label={t("application.contact.apt")}>
            {listing.leasingAgentAddress?.street2}
          </ViewItem>
        </GridSection>
        <GridSection columns={6}>
          <GridCell span={2}>
            <ViewItem label={t("application.contact.city")}>
              {listing.leasingAgentAddress?.city}
            </ViewItem>
          </GridCell>
          <ViewItem label={t("application.contact.state")}>
            {listing.leasingAgentAddress?.state}
          </ViewItem>
          <ViewItem label={t("application.contact.zip")}>
            {listing.leasingAgentAddress?.zipCode}
          </ViewItem>
        </GridSection>

        <hr className={"mb-4"} />

        <GridSection columns={3}>
          <ViewItem label={t("listings.paperDifferentAddress")}>
            {listing.applicationMailingAddress ? t("t.yes") : t("t.no")}
          </ViewItem>
        </GridSection>

        {listing.applicationMailingAddress && (
          <GridSection grid={false} subtitle={t("application.contact.mailingAddress")}>
            <GridSection columns={3}>
              <ViewItem label={t("listings.streetAddressOrPOBox")}>
                {listing.applicationMailingAddress?.street}
              </ViewItem>
              <ViewItem label={t("application.contact.apt")}>
                {listing.applicationMailingAddress?.street2}
              </ViewItem>
            </GridSection>
            <GridSection columns={6}>
              <GridCell span={2}>
                <ViewItem label={t("application.contact.city")}>
                  {listing.applicationMailingAddress?.city}
                </ViewItem>
              </GridCell>
              <ViewItem label={t("application.contact.state")}>
                {listing.applicationMailingAddress?.state}
              </ViewItem>
              <ViewItem label={t("application.contact.zip")}>
                {listing.applicationMailingAddress?.zipCode}
              </ViewItem>
            </GridSection>
          </GridSection>
        )}

        <hr className={"mt-4 mb-4"} />

        <GridSection columns={3}>
          <ViewItem label={t("listings.applicationPickupQuestion")}>
            {listing.applicationPickUpAddress || listing.applicationPickUpAddressType
              ? t("t.yes")
              : t("t.no")}
          </ViewItem>
          {listing.applicationPickUpAddressType && (
            <ViewItem label={t("listings.wherePickupQuestion")}>
              {getAddressString(listing.applicationPickUpAddressType)}
            </ViewItem>
          )}
        </GridSection>

        {listing.applicationPickUpAddress && (
          <GridSection grid={false} subtitle={t("listings.pickupAddress")}>
            <GridSection columns={3}>
              <ViewItem label={t("listings.streetAddressOrPOBox")}>
                {listing.applicationPickUpAddress?.street}
              </ViewItem>
              <ViewItem label={t("application.contact.apt")}>
                {listing.applicationPickUpAddress?.street2}
              </ViewItem>
            </GridSection>
            <GridSection columns={6}>
              <GridCell span={2}>
                <ViewItem label={t("application.contact.city")}>
                  {listing.applicationPickUpAddress?.city}
                </ViewItem>
              </GridCell>
              <ViewItem label={t("application.contact.state")}>
                {listing.applicationPickUpAddress?.state}
              </ViewItem>
              <ViewItem label={t("application.contact.zip")}>
                {listing.applicationPickUpAddress?.zipCode}
              </ViewItem>
            </GridSection>
            <GridSection columns={3}>
              <GridCell span={2}>
                <ViewItem label={t("leasingAgent.officeHours")}>
                  {getDetailFieldString(listing.applicationPickUpAddressOfficeHours)}
                </ViewItem>
              </GridCell>
            </GridSection>
          </GridSection>
        )}

        <hr className={"mt-4 mb-4"} />

        <GridSection columns={3}>
          <ViewItem label={t("listings.applicationDropOffQuestion")}>
            {listing.applicationDropOffAddress || listing.applicationDropOffAddressType
              ? t("t.yes")
              : t("t.no")}
          </ViewItem>
          {listing.applicationDropOffAddressType && (
            <ViewItem label={t("listings.whereDropOffQuestion")}>
              {getAddressString(listing.applicationDropOffAddressType)}
            </ViewItem>
          )}
        </GridSection>

        {listing.applicationDropOffAddress && (
          <GridSection grid={false} subtitle={t("listings.dropOffAddress")}>
            <GridSection columns={3}>
              <ViewItem label={t("listings.streetAddressOrPOBox")}>
                {listing.applicationDropOffAddress?.street}
              </ViewItem>
              <ViewItem label={t("application.contact.apt")}>
                {listing.applicationDropOffAddress?.street2}
              </ViewItem>
            </GridSection>
            <GridSection columns={6}>
              <GridCell span={2}>
                <ViewItem label={t("application.contact.city")}>
                  {listing.applicationDropOffAddress?.city}
                </ViewItem>
              </GridCell>
              <ViewItem label={t("application.contact.state")}>
                {listing.applicationDropOffAddress?.state}
              </ViewItem>
              <ViewItem label={t("application.contact.zip")}>
                {listing.applicationDropOffAddress?.zipCode}
              </ViewItem>
            </GridSection>
            <GridSection columns={3}>
              <GridCell span={2}>
                <ViewItem label={t("leasingAgent.officeHours")}>
                  {getDetailFieldString(listing.applicationDropOffAddressOfficeHours)}
                </ViewItem>
              </GridCell>
            </GridSection>
          </GridSection>
        )}

        <hr className={"mt-4 mb-4"} />

        <GridSection columns={3}>
          <ViewItem label={t("listings.postmarksConsideredQuestion")}>
            {listing.postmarkedApplicationsReceivedByDate ? t("t.yes") : t("t.no")}
          </ViewItem>
        </GridSection>

        {listing.postmarkedApplicationsReceivedByDate && (
          <GridSection columns={4}>
            <GridCell span={2}>
              <ViewItem label={t("listings.postmarkByDate")}>
                {new Date(listing.postmarkedApplicationsReceivedByDate).toDateString()}
              </ViewItem>
            </GridCell>
          </GridSection>
        )}

        <GridSection columns={2}>
          <ViewItem label={t("listings.additionalApplicationSubmissionNotes")}>
            {getDetailFieldString(listing.additionalApplicationSubmissionNotes)}
          </ViewItem>
        </GridSection>
      </GridSection>
    </GridSection>
  )
}

export default DetailApplicationAddress
