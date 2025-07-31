import React, { useContext, useMemo } from "react"
import { t, MinimalTable } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { AuthContext, listingSectionQuestions } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailPreferences = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const disableListingPreferences = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.disableListingPreferences,
    listing.jurisdictions.id
  )

  const preferencesTableHeaders = {
    order: "t.order",
    name: "t.name",
    description: "t.descriptionTitle",
  }

  const preferenceTableData = useMemo(
    () =>
      listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.preferences)?.map(
        (listingPreference, index) => ({
          order: { content: index + 1 },
          name: { content: listingPreference?.multiselectQuestions?.text },
          description: { content: listingPreference?.multiselectQuestions?.description },
        })
      ),
    [listing]
  )

  if (disableListingPreferences) return null

  return (
    <SectionWithGrid heading={t("listings.sections.housingPreferencesTitle")} inset bypassGrid>
      <Grid.Row>
        <Grid.Cell>
          <SectionWithGrid.HeadingRow>{t("listings.activePreferences")}</SectionWithGrid.HeadingRow>
          {preferenceTableData.length ? (
            <MinimalTable
              id="preferenceTable"
              className="spacer-section-above"
              headers={preferencesTableHeaders}
              data={preferenceTableData}
            />
          ) : (
            <FieldValue className="spacer-section-above">{t("t.none")}</FieldValue>
          )}
        </Grid.Cell>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export default DetailPreferences
