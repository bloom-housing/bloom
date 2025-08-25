import React, { useContext } from "react"
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
        <Grid.Cell>
          <FieldValue id="creditHistory" label={t("listings.creditHistory")}>
            {getDetailFieldString(listing.creditHistory)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>

      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="rentalHistory" label={t("listings.rentalHistory")}>
            {getDetailFieldString(listing.rentalHistory)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>

      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="criminalBackground" label={t("listings.criminalBackground")}>
            {getDetailFieldString(listing.criminalBackground)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>

      <Grid.Row>
        <Grid.Cell>
          <FieldValue id="rentalAssistance" label={t("listings.sections.rentalAssistanceTitle")}>
            {getDetailFieldString(listing.rentalAssistance)}
          </FieldValue>
        </Grid.Cell>
      </Grid.Row>

      {(listing.buildingSelectionCriteria ||
        listing.listingsBuildingSelectionCriteriaFile?.fileId) && (
        <Grid.Row columns={1}>
          <Grid.Cell>
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
                        content: `${listing.listingsBuildingSelectionCriteriaFile.fileId
                          .split("/")
                          .slice(-1)
                          .join()}.pdf`,
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
          </Grid.Cell>
        </Grid.Row>
      )}
    </SectionWithGrid>
  )
}

export default DetailAdditionalEligibility
