import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailCommunityType = () => {
  const listing = useContext(ListingContext)

  const includeCommunityDisclaimer = listing.includeCommunityDisclaimer

  return (
    <SectionWithGrid heading={t("listings.sections.communityType")} inset>
      <Grid.Row>
        <FieldValue id="reservedCommunityType" label={t("listings.reservedCommunityType")}>
          {getDetailFieldString(
            listing.reservedCommunityTypes
              ? t(`listings.reservedCommunityTypes.${listing.reservedCommunityTypes.name}`)
              : null
          )}
        </FieldValue>
      </Grid.Row>
      <Grid.Row>
        <FieldValue
          id="reservedCommunityDescription"
          label={t("listings.reservedCommunityDescription")}
        >
          {getDetailFieldString(listing.reservedCommunityDescription)}
        </FieldValue>
      </Grid.Row>

      <Grid.Row>
        <FieldValue
          id="includeCommunityDisclaimer"
          label={t("listings.includeCommunityDisclaimer")}
        >
          {includeCommunityDisclaimer ? t("t.yes") : t("t.no")}
        </FieldValue>
      </Grid.Row>
      {includeCommunityDisclaimer && (
        <>
          <Grid.Row>
            <FieldValue
              id="communityDisclaimerTitle"
              label={t("listings.reservedCommunityDisclaimerTitle")}
            >
              {getDetailFieldString(listing.communityDisclaimerTitle)}
            </FieldValue>
            <FieldValue
              id="communityDisclaimerDescription"
              label={t("listings.reservedCommunityDisclaimer")}
            >
              {getDetailFieldString(listing.communityDisclaimerDescription)}
            </FieldValue>
          </Grid.Row>
        </>
      )}
    </SectionWithGrid>
  )
}

export default DetailCommunityType
