import React from "react"
import { t, MinimalTable, TableThumbnail } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { cloudinaryUrlFromId } from "@bloom-housing/shared-helpers"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type DetailMarketingFlyerSectionProps = {
  listing: Listing | null
  enableMarketingFlyer: boolean
}

const PreviewMarketingFlyer = ({
  label,
  fileId,
  url,
}: {
  label: string
  fileId?: string
  url?: string
}) => {
  let content = null

  if (fileId) {
    content = (
      <MinimalTable
        headers={{ preview: "t.preview", fileName: "t.fileName" }}
        data={[
          {
            preview: {
              content: (
                <TableThumbnail>
                  <img alt="PDF preview" src={cloudinaryUrlFromId(fileId)} />
                </TableThumbnail>
              ),
            },
            fileName: {
              content: `${fileId.split("/").slice(-1).join()}.pdf`,
            },
          },
        ]}
      />
    )
  } else if (url) {
    content = (
      <MinimalTable
        headers={{ url: "t.url" }}
        data={[
          {
            url: {
              content: url,
            },
          },
        ]}
      />
    )
  } else {
    content = t("t.none")
  }

  return (
    <Grid.Row columns={1}>
      <Grid.Cell>
        <FieldValue label={label}>{content}</FieldValue>
      </Grid.Cell>
    </Grid.Row>
  )
}

const DetailMarketingFlyerSection = ({
  listing,
  enableMarketingFlyer,
}: DetailMarketingFlyerSectionProps) => {
  if (
    !enableMarketingFlyer ||
    !listing ||
    (!listing.marketingFlyer &&
      !listing.listingsMarketingFlyerFile?.fileId &&
      !listing.accessibleMarketingFlyer &&
      !listing.listingsAccessibleMarketingFlyerFile?.fileId)
  ) {
    return null
  }

  return (
    <>
      <PreviewMarketingFlyer
        label={t("listings.marketingFlyer.title")}
        fileId={listing.listingsMarketingFlyerFile?.fileId}
        url={listing.marketingFlyer}
      />
      <PreviewMarketingFlyer
        label={t("listings.marketingFlyer.accessibleTitle")}
        fileId={listing.listingsAccessibleMarketingFlyerFile?.fileId}
        url={listing.accessibleMarketingFlyer}
      />
    </>
  )
}

export default DetailMarketingFlyerSection
