import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString, getDetailAddress } from "./helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailLeasingAgent = () => {
  const listing = useContext(ListingContext)

  return (
    <SectionWithGrid heading={t("listings.sections.leasingAgentTitle")} inset>
      <Grid.Row>
        <FieldValue id="leasingAgentName" label={t("leasingAgent.name")}>
          {getDetailFieldString(listing.leasingAgentName)}
        </FieldValue>

        <FieldValue id="leasingAgentEmail" label={t("t.email")}>
          {getDetailFieldString(listing.leasingAgentEmail)}
        </FieldValue>

        <FieldValue id="leasingAgentPhone" label={t("t.phone")}>
          {getDetailFieldString(listing.leasingAgentPhone)}
        </FieldValue>
      </Grid.Row>
      <Grid.Row>
        <FieldValue id="leasingAgentTitle" label={t("leasingAgent.title")}>
          {getDetailFieldString(listing.leasingAgentTitle)}
        </FieldValue>

        <FieldValue id="leasingAgentOfficeHours" label={t("leasingAgent.officeHours")}>
          {getDetailFieldString(listing.leasingAgentOfficeHours)}
        </FieldValue>
      </Grid.Row>
      {getDetailAddress(
        listing.leasingAgentAddress,
        "leasingAgentAddress",
        t("listings.leasingAgentAddress")
      )}
    </SectionWithGrid>
  )
}

export default DetailLeasingAgent
