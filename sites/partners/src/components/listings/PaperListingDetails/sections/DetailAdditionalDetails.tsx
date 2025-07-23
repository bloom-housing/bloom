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
        <Grid.Cell>
          <FieldValue id="requiredDocuments" label={t("listings.requiredDocuments")}>
            {getDetailFieldString(listing.requiredDocuments)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="programRules" label={t("listings.importantProgramRules")}>
            {getDetailFieldString(listing.programRules)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="specialNotes" label={t("listings.specialNotes")}>
            {getDetailFieldString(listing.specialNotes)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export default DetailAdditionalDetails
