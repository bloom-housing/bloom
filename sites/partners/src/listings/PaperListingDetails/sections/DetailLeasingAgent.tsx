import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailLeasingAgent = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.leasingAgentTitle")}
      grid={false}
      inset
    >
      <GridSection columns={3}>
        <GridCell>
          <ViewItem label={t("leasingAgent.name")}>{listing.leasingAgentName}</ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("t.email")}>{listing.leasingAgentEmail}</ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("t.phone")}>{listing.leasingAgentPhone}</ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={t("leasingAgent.title")}>{listing.leasingAgentTitle}</ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("leasingAgent.officeHours")}>
            {listing.leasingAgentOfficeHours}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailLeasingAgent
