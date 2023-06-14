import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString, getDetailAddress } from "./helpers"

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
          <FieldValue id="leasingAgentName" label={t("leasingAgent.name")}>
            {getDetailFieldString(listing.leasingAgentName)}
          </FieldValue>
        </GridCell>
        <GridCell>
          <FieldValue id="leasingAgentEmail" label={t("t.email")}>
            {getDetailFieldString(listing.leasingAgentEmail)}
          </FieldValue>
        </GridCell>
        <GridCell>
          <FieldValue id="leasingAgentPhone" label={t("t.phone")}>
            {getDetailFieldString(listing.leasingAgentPhone)}
          </FieldValue>
        </GridCell>
      </GridSection>
      <GridSection columns={2}>
        <GridCell>
          <FieldValue id="leasingAgentTitle" label={t("leasingAgent.title")}>
            {getDetailFieldString(listing.leasingAgentTitle)}
          </FieldValue>
        </GridCell>
        <GridCell>
          <FieldValue id="leasingAgentOfficeHours" label={t("leasingAgent.officeHours")}>
            {getDetailFieldString(listing.leasingAgentOfficeHours)}
          </FieldValue>
        </GridCell>
      </GridSection>
      {getDetailAddress(
        listing.leasingAgentAddress,
        "leasingAgentAddress",
        t("listings.leasingAgentAddress")
      )}
    </GridSection>
  )
}

export default DetailLeasingAgent
