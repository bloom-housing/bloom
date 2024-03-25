import React, { useContext } from "react"
import { pdfFileNameFromFileId } from "../../../../lib/helpers"
import { t, MinimalTable, TableThumbnail } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailAdditionalEligibility = () => {
  const listing = useContext(ListingContext)

  return (
    <SectionWithGrid heading={t("listings.sections.additionalEligibilityTitle")} inset>
      <Grid.Row>
        <FieldValue id="creditHistory" label={t("listings.creditHistory")}>
          {getDetailFieldString(listing.creditHistory)}
        </FieldValue>
      </Grid.Row>

      <Grid.Row>
        <FieldValue id="rentalHistory" label={t("listings.rentalHistory")}>
          {getDetailFieldString(listing.rentalHistory)}
        </FieldValue>
      </Grid.Row>

      <Grid.Row>
        <FieldValue id="criminalBackground" label={t("listings.criminalBackground")}>
          {getDetailFieldString(listing.criminalBackground)}
        </FieldValue>
      </Grid.Row>

      <Grid.Row>
        <FieldValue id="rentalAssistance" label={t("listings.sections.rentalAssistanceTitle")}>
          {getDetailFieldString(listing.rentalAssistance)}
        </FieldValue>
      </Grid.Row>

      {(listing.buildingSelectionCriteria ||
        listing.listingsBuildingSelectionCriteriaFile?.fileId) && (
        <Grid.Row columns={1}>
          <FieldValue label={t("listings.buildingSelectionCriteria")}>
            {listing.listingsBuildingSelectionCriteriaFile?.fileId ? (
              <MinimalTable
                id="buildingSelectionCriteriaTable"
                headers={{ preview: "t.preview", fileName: "t.fileName" }}
                data={[
                  {
                    preview: {
                      content: (
                        <TableThumbnail>
                          <img
                            alt="PDF preview"
                            src={listing.listingsBuildingSelectionCriteriaFile.fileId}
                          />
                        </TableThumbnail>
                      ),
                    },
                    fileName: {
                      content: pdfFileNameFromFileId(
                        listing.listingsBuildingSelectionCriteriaFile.fileId
                      ),
                    },
                  },
                ]}
              />
            ) : (
              <MinimalTable
                id="buildingSelectionCriteriaTable"
                headers={{ url: "t.url" }}
                data={[
                  {
                    url: { content: listing.buildingSelectionCriteria },
                  },
                ]}
              />
            )}
          </FieldValue>
        </Grid.Row>
      )}
    </SectionWithGrid>
  )
}

export default DetailAdditionalEligibility
