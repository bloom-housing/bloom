import * as React from "react"
import { ImageCard } from "../../blocks/ImageCard"
import { Asset, Listing } from "@bloom-housing/core"
import { LinkButton } from "../../actions/LinkButton"
import { groupNonReservedAndReservedSummaries } from "../../helpers/tableSummaries"
import { GroupedTable, GroupedTableGroup } from "../../tables/GroupedTable"
import { t } from "../../helpers/translator"
import "./ListingsList.scss"

export interface ListingsProps {
  listings: Listing[]
}

const imageUrlFromListing = (listing: Listing) => {
  return listing?.assets?.find((asset: Asset) => asset.label == "building")?.fileId
}

const ListingsList = (props: ListingsProps) => {
  const listings = props.listings

  const listItems = listings.map((listing: Listing) => {
    const imageUrl = imageUrlFromListing(listing) || ""
    const unitSummariesHeaders = {
      unitType: t("t.unitType"),
      minimumIncome: t("t.minimumIncome"),
      rent: t("t.rent"),
    }

    let unitSummaries = [] as GroupedTableGroup[]
    if (listing.property.unitsSummarized !== undefined) {
      unitSummaries = groupNonReservedAndReservedSummaries(
        listing.property.unitsSummarized.byNonReservedUnitType,
        listing.property.unitsSummarized.byReservedType
      )
    }

    // address as subtitle
    const { street, city, state, zipCode } = listing.property?.buildingAddress || {}
    const subtitle = `${street}, ${city} ${state}, ${zipCode}`

    return (
      <article key={listing.id} className="listings-row">
        <div className="listings-row_figure">
          <ImageCard
            title={listing.name}
            subtitle={subtitle}
            imageUrl={imageUrl}
            href={`listing/id=${listing.id}`}
            as={`/listing/${listing.id}`}
            listing={listing}
          />
        </div>
        <div className="listings-row_content">
          <h4 className="listings-row_title">{t("listings.waitlist.open")}</h4>
          <div className="listings-row_table">
            {unitSummaries && (
              <GroupedTable
                headers={unitSummariesHeaders}
                data={unitSummaries}
                responsiveCollapse={true}
                cellClassName="px-5 py-3"
              />
            )}
          </div>
          <LinkButton
            href={`listing/id=${listing.id}`}
            as={`/listing/${listing.id}/${listing.urlSlug}`}
          >
            {t("label.seeDetails")}
          </LinkButton>
        </div>
      </article>
    )
  })

  return <>{listItems}</>
}

export { ListingsList as default, ListingsList, imageUrlFromListing }
