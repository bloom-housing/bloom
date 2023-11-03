import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailAdditionalDetails = () => {
  const listing = useContext(ListingContext)

  return (
    <SectionWithGrid heading={t("listings.sections.additionalDetails")} inset>
      <Grid.Row>
        <FieldValue id="requiredDocuments" label={t("listings.requiredDocuments")}>
          {getDetailFieldString(listing.requiredDocuments)}
        </FieldValue>
      </Grid.Row>
      <Grid.Row>
        <FieldValue id="programRules" label={t("listings.importantProgramRules")}>
          {getDetailFieldString(listing.programRules)}
        </FieldValue>
      </Grid.Row>
      <Grid.Row>
        <FieldValue id="specialNotes" label={t("listings.specialNotes")}>
          {getDetailFieldString(listing.specialNotes)}
        </FieldValue>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export default DetailAdditionalDetails
