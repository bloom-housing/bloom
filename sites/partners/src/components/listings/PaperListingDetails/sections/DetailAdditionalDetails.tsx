import React, { useContext } from "react"
import { GridCell, t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailAdditionalDetails = () => {
  const listing = useContext(ListingContext)

  const getRequiredDocuments = () => {
    let documentsExist = false
    const documents = Object.keys(listing?.requiredDocumentsList ?? {}).map((document) => {
      if (document) {
        documentsExist = true
        return (
          <li key={document} className={"list-disc mx-5 mb-1 w-full grow text-nowrap"}>
            {t(`listings.requiredDocuments.${document.trim()}`)}
          </li>
        )
      }
    })
    return documentsExist ? <ul className={"flex flex-wrap"}>{documents}</ul> : <>{t("t.none")}</>
  }

  return (
    <SectionWithGrid heading={t("listings.sections.additionalDetails")} inset>
      <Grid.Row>
        <GridCell>
          <FieldValue id="requiredDocumentsList" label={t("listings.requiredDocuments")}>
            {getRequiredDocuments()}
          </FieldValue>
        </GridCell>
      </Grid.Row>
      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="requiredDocuments" label={t("listings.requiredDocumentsAdditionalInfo")}>
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
