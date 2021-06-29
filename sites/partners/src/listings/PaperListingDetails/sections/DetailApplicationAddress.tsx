import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailApplicationAddress = () => {
  const listing = useContext(ListingContext)

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
            {listing.applicationAddress.street}
          </ViewItem>
          <ViewItem label={t("application.contact.apt")}>
            {listing.applicationAddress.street2}
          </ViewItem>
        </GridSection>
        <GridSection columns={6}>
          <GridCell span={2}>
            <ViewItem label={t("application.contact.city")}>
              {listing.applicationAddress.city}
            </ViewItem>
          </GridCell>
          <ViewItem label={t("application.contact.state")}>
            {listing.applicationAddress.state}
          </ViewItem>
          <ViewItem label={t("application.contact.zip")}>
            {listing.applicationAddress.zipCode}
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
                {listing.applicationMailingAddress.street}
              </ViewItem>
              <ViewItem label={t("application.contact.apt")}>
                {listing.applicationMailingAddress.street2}
              </ViewItem>
            </GridSection>
            <GridSection columns={6}>
              <GridCell span={2}>
                <ViewItem label={t("application.contact.city")}>
                  {listing.applicationMailingAddress.city}
                </ViewItem>
              </GridCell>
              <ViewItem label={t("application.contact.state")}>
                {listing.applicationMailingAddress.state}
              </ViewItem>
              <ViewItem label={t("application.contact.zip")}>
                {listing.applicationMailingAddress.zipCode}
              </ViewItem>
            </GridSection>
            <GridSection columns={3}>
              <GridCell span={2}>
                <ViewItem label={t("leasingAgent.officeHours")}>
                  {listing.applicationMailingAddress.officeHours}
                </ViewItem>
              </GridCell>
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
              {listing.applicationPickUpAddressType}
            </ViewItem>
          )}
        </GridSection>

        {listing.applicationPickUpAddress && (
          <GridSection grid={false} subtitle={t("listings.pickupAddress")}>
            <GridSection columns={3}>
              <ViewItem label={t("listings.streetAddressOrPOBox")}>
                {listing.applicationPickUpAddress.street}
              </ViewItem>
              <ViewItem label={t("application.contact.apt")}>
                {listing.applicationPickUpAddress.street2}
              </ViewItem>
            </GridSection>
            <GridSection columns={6}>
              <GridCell span={2}>
                <ViewItem label={t("application.contact.city")}>
                  {listing.applicationPickUpAddress.city}
                </ViewItem>
              </GridCell>
              <ViewItem label={t("application.contact.state")}>
                {listing.applicationPickUpAddress.state}
              </ViewItem>
              <ViewItem label={t("application.contact.zip")}>
                {listing.applicationPickUpAddress.zipCode}
              </ViewItem>
            </GridSection>
            <GridSection columns={3}>
              <GridCell span={2}>
                <ViewItem label={t("leasingAgent.officeHours")}>
                  {listing.applicationPickUpAddress.officeHours}
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
              {listing.applicationDropOffAddressType}
            </ViewItem>
          )}
        </GridSection>

        {listing.applicationDropOffAddress && (
          <GridSection grid={false} subtitle={t("listings.dropOffAddress")}>
            <GridSection columns={3}>
              <ViewItem label={t("listings.streetAddressOrPOBox")}>
                {listing.applicationDropOffAddress.street}
              </ViewItem>
              <ViewItem label={t("application.contact.apt")}>
                {listing.applicationDropOffAddress.street2}
              </ViewItem>
            </GridSection>
            <GridSection columns={6}>
              <GridCell span={2}>
                <ViewItem label={t("application.contact.city")}>
                  {listing.applicationDropOffAddress.city}
                </ViewItem>
              </GridCell>
              <ViewItem label={t("application.contact.state")}>
                {listing.applicationDropOffAddress.state}
              </ViewItem>
              <ViewItem label={t("application.contact.zip")}>
                {listing.applicationDropOffAddress.zipCode}
              </ViewItem>
            </GridSection>
            <GridSection columns={3}>
              <GridCell span={2}>
                <ViewItem label={t("leasingAgent.officeHours")}>
                  {listing.applicationDropOffAddress.officeHours}
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
                {listing.postmarkedApplicationsReceivedByDate}
              </ViewItem>
            </GridCell>
          </GridSection>
        )}
      </GridSection>
    </GridSection>
  )
}

export default DetailApplicationAddress
