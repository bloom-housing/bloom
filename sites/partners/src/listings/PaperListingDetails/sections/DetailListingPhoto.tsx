import React, { useContext } from "react"
import {
  cloudinaryUrlFromId,
  t,
  GridSection,
  GridCell,
  MinimalTable,
  TableThumbnail,
} from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailListingPhoto = () => {
  const listing = useContext(ListingContext)

  let listingFormPhoto = listing.image

  // Set listing photo from assets if necessary:
  if (listing.image == null && listing.assets.length > 0) {
    listingFormPhoto = listing.assets.find((asset) => asset.label == "building")
  }
  if (!listingFormPhoto) return <></>

  const listingPhotoUrl = /https?:\/\//.exec(listingFormPhoto.fileId)
    ? listingFormPhoto.fileId
    : cloudinaryUrlFromId(listingFormPhoto.fileId)

  const photoTableHeaders = {
    preview: "t.preview",
    fileName: "t.fileName",
  }
  const photoTableData = [
    {
      preview: (
        <TableThumbnail>
          <img src={listingPhotoUrl} />
        </TableThumbnail>
      ),
      fileName: listingFormPhoto.fileId.split("/").slice(-1).join(),
    },
  ]

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.photoTitle")}
      grid={false}
      inset
    >
      <GridSection>
        <GridCell span={2}>
          <MinimalTable headers={photoTableHeaders} data={photoTableData}></MinimalTable>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailListingPhoto
