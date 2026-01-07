import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString, getDetailAddress } from "./helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const DetailLeasingAgent = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const enableCompanyWebsite = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableCompanyWebsite,
    listing.jurisdictions.id
  )

  const enableLeasingAgentAltText = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableLeasingAgentAltText,
    listing.jurisdictions.id
  )

  const leasingAgentNameText = enableLeasingAgentAltText
    ? t("leasingAgent.ManagerPropName")
    : t("leasingAgent.name")

  const leasingAgentTitleText = enableLeasingAgentAltText
    ? t("listings.sections.leasingAgentManagerPropTitle")
    : t("listings.sections.leasingAgentTitle")

  const leasingAgentAddressText = enableLeasingAgentAltText
    ? t("listings.leasingAgentAddressManagerProp")
    : t("listings.leasingAgentAddress")

  return (
    <SectionWithGrid heading={leasingAgentTitleText} inset>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="leasingAgentName" label={leasingAgentNameText}>
            {getDetailFieldString(listing.leasingAgentName)}
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
          <FieldValue id="leasingAgentEmail" label={t("t.email")}>
            {getDetailFieldString(listing.leasingAgentEmail)}
          </FieldValue>
        </Grid.Cell>

        <Grid.Cell>
          <FieldValue id="leasingAgentPhone" label={t("t.phone")}>
            {getDetailFieldString(listing.leasingAgentPhone)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row columns={3}>
        <Grid.Cell>
          <FieldValue id="leasingAgentTitle" label={t("leasingAgent.title")}>
            {getDetailFieldString(listing.leasingAgentTitle)}
          </FieldValue>
        </Grid.Cell>

        {enableCompanyWebsite && (
          <Grid.Cell>
            <FieldValue id="managementWebsite" label={t("leasingAgent.managementWebsite")}>
              {getDetailFieldString(listing.managementWebsite)}
            </FieldValue>
          </Grid.Cell>
        )}

        <Grid.Cell>
          <FieldValue
            id="leasingAgentOfficeHours"
            className="seeds-grid-span-2"
            label={t("leasingAgent.officeHours")}
          >
            {getDetailFieldString(listing.leasingAgentOfficeHours)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      {getDetailAddress(
        listing.listingsLeasingAgentAddress,
        "leasingAgentAddress",
        leasingAgentAddressText
      )}
    </SectionWithGrid>
  )
}

export default DetailLeasingAgent
