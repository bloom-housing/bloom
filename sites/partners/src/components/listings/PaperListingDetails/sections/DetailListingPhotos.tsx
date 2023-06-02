import React, { useContext } from "react"
import {
  t,
  GridSection,
  GridCell,
  MinimalTable,
  TableThumbnail,
} from "@bloom-housing/ui-components"
import { getUrlForListingImage } from "@bloom-housing/shared-helpers"
import { ListingContext } from "../../ListingContext"
import { Asset } from "@bloom-housing/backend-core/types"

const photoTableHeaders = {
  preview: "t.preview",
  fileName: "t.fileName",
  primary: "t.primary",
}

const DetailListingPhotos = () => {
  const listing = useContext(ListingContext)

  const listingFormPhotos = listing.images
    .sort((imageA, imageB) => imageA.ordinal - imageB.ordinal)
    .map((image) => image.image as Asset)

  const photoTableData = listingFormPhotos.map((image, index) => {
    return {
      preview: {
        content: (
          <TableThumbnail>
            <img src={getUrlForListingImage(image)} alt={t("listings.sections.photoTitle")} />
          </TableThumbnail>
        ),
      },
      fileName: { content: image.fileId.split("/").slice(-1).join() },
      primary: {
        content: index == 0 ? t("listings.sections.photo.primaryPhoto") : "",
      },
    }
  })

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.photoTitle")}
      grid={false}
      inset
    >
      <GridSection columns={1}>
        <GridCell>
          {listing.images.length > 0 ? (
            <MinimalTable
              id="listingPhotoTable"
              headers={photoTableHeaders}
              data={photoTableData}
            />
          ) : (
            <span className={"view-item__value"}>{t("t.none")}</span>
          )}
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailListingPhotos
