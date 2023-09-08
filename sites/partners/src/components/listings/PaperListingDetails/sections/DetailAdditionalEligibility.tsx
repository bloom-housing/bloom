import React, { useContext } from "react"
import {
  t,
  MinimalTable,
  TableThumbnail,
} from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { cloudinaryUrlFromId } from "@bloom-housing/shared-helpers"
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

      {(listing.buildingSelectionCriteria || listing.buildingSelectionCriteriaFile?.fileId) && (
        <Grid.Row columns={1}>
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
                          <img
                            alt="PDF preview"
                            src={cloudinaryUrlFromId(listing.buildingSelectionCriteriaFile.fileId)}
                          />
                        </TableThumbnail>
                      ),
                    },
                    fileName: {
                      content: `${listing.buildingSelectionCriteriaFile.fileId
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
        </Grid.Row>
      )}
    </SectionWithGrid>
  )
}

export default DetailAdditionalEligibility
