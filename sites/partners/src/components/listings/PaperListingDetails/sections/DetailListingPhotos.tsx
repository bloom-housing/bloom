import React, { useContext } from "react"
import { t, MinimalTable, TableThumbnail } from "@bloom-housing/ui-components"
import { AuthContext, getUrlForListingImage } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { ListingContext } from "../../ListingContext"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const DetailListingPhotos = () => {
  const listing = useContext(ListingContext)
  const jurisdictionId = listing.jurisdictions.id
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const enableListingImageAltText = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableListingImageAltText,
    jurisdictionId
  )

  const photoTableHeaders = {
    preview: "t.preview",
    ...(enableListingImageAltText
      ? { description: "listings.sections.photo.imageDescription" }
      : {}),
  }

  const listingFormPhotos = listing.listingImages
    .sort((imageA, imageB) => imageA.ordinal - imageB.ordinal)
    .map((image) => image.assets)

  const photoTableData = listingFormPhotos.map((image, index) => {
    return {
      preview: {
        content: (
          <TableThumbnail>
            <img
              src={getUrlForListingImage(image)}
              alt={t("listings.sections.photoTitle")}
              id={`listing-detail-image-${index}`}
            />
          </TableThumbnail>
        ),
      },
      ...(enableListingImageAltText
        ? {
            description: {
              content: listing.listingImages[index].description || "",
            },
          }
        : {}),
    }
  })

  return (
    <SectionWithGrid heading={t("listings.sections.photoTitle")} inset bypassGrid>
      <Grid.Row>
        <Grid.Cell>
          {listing.listingImages.length > 0 ? (
            <MinimalTable
              id="listingPhotoTable"
              headers={photoTableHeaders}
              data={photoTableData}
            />
          ) : (
            <FieldValue>{t("t.none")}</FieldValue>
          )}
        </Grid.Cell>
      </Grid.Row>
    </SectionWithGrid>
  )
}

export default DetailListingPhotos
