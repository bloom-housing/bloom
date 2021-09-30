import React, { useContext } from "react"
import {
  t,
  GridSection,
  ViewItem,
  GridCell,
  MinimalTable,
  cloudinaryUrlFromId,
  TableThumbnail,
} from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldString } from "./helpers"

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
          <ViewItem label={t("listings.creditHistory")}>
            {getDetailFieldString(listing.creditHistory)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem label={t("listings.rentalHistory")}>
            {getDetailFieldString(listing.rentalHistory)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem label={t("listings.criminalBackground")}>
            {getDetailFieldString(listing.criminalBackground)}
          </ViewItem>
        </GridCell>
      </GridSection>
      <GridSection columns={1}>
        <GridCell>
          <ViewItem label={t("listings.sections.rentalAssistanceTitle")}>
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
                headers={{ preview: "t.preview", fileName: "t.fileName" }}
                data={[
                  {
                    preview: (
                      <TableThumbnail>
                        <img
                          alt="PDF preview"
                          src={cloudinaryUrlFromId(listing.buildingSelectionCriteriaFile.fileId)}
                        />
                      </TableThumbnail>
                    ),
                    fileName: `${listing.buildingSelectionCriteriaFile.fileId
                      .split("/")
                      .slice(-1)
                      .join()}.pdf`,
                  },
                ]}
              />
            ) : (
              <MinimalTable
                headers={{ url: t("t.url") }}
                data={[
                  {
                    url: listing.buildingSelectionCriteria,
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
