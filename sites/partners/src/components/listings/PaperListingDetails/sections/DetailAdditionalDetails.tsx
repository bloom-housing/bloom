import React, { useContext } from "react"
import { GridCell, t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  EnumListingListingType,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const DetailAdditionalDetails = () => {
  const listing = useContext(ListingContext)
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)

  const getRequiredDocuments = () => {
    let documentsExist = false
    const documents = Object.entries(listing?.requiredDocumentsList ?? {}).map(
      ([document, value]) => {
        if (document && value) {
          documentsExist = true
          return (
            <li key={document} className={"list-disc mx-5 mb-1 w-full grow text-nowrap"}>
              {t(`listings.requiredDocuments.${document.trim()}`)}
            </li>
          )
        }
      }
    )
    return documentsExist ? <ul className={"flex flex-wrap"}>{documents}</ul> : <>{t("t.none")}</>
  }

  const enableNonRegulatedListings = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableNonRegulatedListings,
    listing.jurisdictions.id
  )

  const showRequiredDocumentsListField =
    enableNonRegulatedListings && listing.listingType === EnumListingListingType.nonRegulated

  return (
    <SectionWithGrid heading={t("listings.sections.additionalDetails")} inset>
      {showRequiredDocumentsListField && (
        <Grid.Row>
          <GridCell>
            <FieldValue id="requiredDocumentsList" label={t("listings.requiredDocuments")}>
              {getRequiredDocuments()}
            </FieldValue>
          </GridCell>
        </Grid.Row>
      )}
      <Grid.Row>
        <Grid.Cell>
          <FieldValue
            id="requiredDocuments"
            label={
              showRequiredDocumentsListField
                ? t("listings.requiredDocumentsAdditionalInfo")
                : t("listings.requiredDocuments")
            }
          >
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
