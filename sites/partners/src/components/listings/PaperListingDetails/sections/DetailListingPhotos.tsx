import React, { useContext } from "react"
import { t, MinimalTable, TableThumbnail } from "@bloom-housing/ui-components"
import { getImageUrlFromAsset } from "@bloom-housing/shared-helpers"
import { ListingContext } from "../../ListingContext"
import { Asset } from "@bloom-housing/backend-core/types"
import { FieldValue } from "@bloom-housing/ui-seeds"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const photoTableHeaders = {
  preview: "t.preview",
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
            <img src={getImageUrlFromAsset(image)} alt={t("listings.sections.photoTitle")} />
          </TableThumbnail>
        ),
      },

      primary: {
        content: index == 0 ? t("listings.sections.photo.primaryPhoto") : "",
      },
    }
  })

  return (
    <SectionWithGrid heading={t("listings.sections.photoTitle")} inset bypassGrid>
      {listing.images.length > 0 ? (
        <MinimalTable id="listingPhotoTable" headers={photoTableHeaders} data={photoTableData} />
      ) : (
        <FieldValue>{t("t.none")}</FieldValue>
      )}
    </SectionWithGrid>
  )
}

export default DetailListingPhotos
