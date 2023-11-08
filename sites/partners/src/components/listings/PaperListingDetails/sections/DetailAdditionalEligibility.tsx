import React, { useContext } from "react"
import {
  t,
  GridSection,
  GridCell,
  MinimalTable,
  TableThumbnail,
  Icon,
} from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import { pdfFileNameFromFileId } from "../../../../lib/helpers"

const DetailAdditionalEligibility = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.additionalEligibilityTitle")}
      grid={false}
      inset
    >
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="creditHistory" label={t("listings.creditHistory")}>
            {getDetailFieldString(listing.creditHistory)}
          </FieldValue>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="rentalHistory" label={t("listings.rentalHistory")}>
            {getDetailFieldString(listing.rentalHistory)}
          </FieldValue>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="criminalBackground" label={t("listings.criminalBackground")}>
            {getDetailFieldString(listing.criminalBackground)}
          </FieldValue>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <FieldValue id="rentalAssistance" label={t("listings.sections.rentalAssistanceTitle")}>
            {getDetailFieldString(listing.rentalAssistance)}
          </FieldValue>
        </GridCell>
      </GridSection>
      {(listing.buildingSelectionCriteria || listing.buildingSelectionCriteriaFile?.fileId) && (
        <GridSection columns={1}>
          <GridCell>
            <FieldValue label={t("listings.buildingSelectionCriteria")}>
              {listing.buildingSelectionCriteriaFile?.fileId ? (
                <MinimalTable
                  id="buildingSelectionCriteriaTable"
                  headers={{ preview: "t.preview", fileName: "t.fileName" }}
                  data={[
                    {
                      preview: {
                        content: (
                          <TableThumbnail>
                            <Icon size="md-large" symbol="document" />
                          </TableThumbnail>
                        ),
                      },
                      fileName: {
                        content: pdfFileNameFromFileId(
                          listing.buildingSelectionCriteriaFile.fileId
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
          </GridCell>
        </GridSection>
      )}
    </GridSection>
  )
}

export default DetailAdditionalEligibility
