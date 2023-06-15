import React, { useContext } from "react"
import {
  t,
  GridSection,
  ViewItem,
  GridCell,
  MinimalTable,
  TableThumbnail,
} from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"
import { Icon } from "@bloom-housing/doorway-ui-components"
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
          <ViewItem id="creditHistory" label={t("listings.creditHistory")}>
            {getDetailFieldString(listing.creditHistory)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="rentalHistory" label={t("listings.rentalHistory")}>
            {getDetailFieldString(listing.rentalHistory)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="criminalBackground" label={t("listings.criminalBackground")}>
            {getDetailFieldString(listing.criminalBackground)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem id="rentalAssistance" label={t("listings.sections.rentalAssistanceTitle")}>
            {getDetailFieldString(listing.rentalAssistance)}
          </ViewItem>
        </GridCell>
      </GridSection>
      {(listing.buildingSelectionCriteria || listing.buildingSelectionCriteriaFile?.fileId) && (
        <GridSection columns={1}>
          <GridCell>
            <ViewItem label={t("listings.buildingSelectionCriteria")} />
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
                      content: pdfFileNameFromFileId(listing.buildingSelectionCriteriaFile.fileId),
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
          </GridCell>
        </GridSection>
      )}
    </GridSection>
  )
}

export default DetailAdditionalEligibility
