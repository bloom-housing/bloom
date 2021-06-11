import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailAdditionalDetails = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-ligher"
      title={t("listings.additionalDetails")}
      grid={false}
      inset
    >
      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={t("listings.requiredDocuments")}>{listing.requiredDocuments}</ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("listings.importantProgramRules")}>{listing.programRules}</ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={t("listings.specialNotes")}>{listing.specialNotes}</ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailAdditionalDetails
