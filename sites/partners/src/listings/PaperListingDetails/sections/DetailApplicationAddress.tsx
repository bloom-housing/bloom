import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailApplicationAddress = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-ligher"
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
        {listing.postmarkedApplicationsReceivedByDate && (
          <GridSection columns={4}>
            <GridCell span={2}>
              <ViewItem label={t("listings.postmarkByDate")}>
                {listing.postmarkedApplicationsReceivedByDate}
              </ViewItem>
            </GridCell>
          </GridSection>
        )}
        {/* <GridSection columns={3}>
          <GridCell span={2}>
            <ViewItem label={t("listings.postmarkByDate")}>
              {listing.????}
            </ViewItem>
          </GridCell>
        </GridSection> */}
      </GridSection>
    </GridSection>
  )
}

export default DetailApplicationAddress
