import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"

const DetailAdditionalDetails = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.additionalDetails")}
      grid={false}
      inset
    >
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="requiredDocuments" label={t("listings.requiredDocuments")}>
            {getDetailFieldString(listing.requiredDocuments)}
          </FieldValue>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="programRules" label={t("listings.importantProgramRules")}>
            {getDetailFieldString(listing.programRules)}
          </FieldValue>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="specialNotes" label={t("listings.specialNotes")}>
            {getDetailFieldString(listing.specialNotes)}
          </FieldValue>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailAdditionalDetails
