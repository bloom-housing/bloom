import * as React from "react"
import ImageCard from "../../cards/ImageCard"
import { Listing } from "@bloom-housing/core"
import LinkButton from "../../atoms/LinkButton"
import { groupNonReservedAndReservedSummaries } from "../../helpers/tableSummaries"
import {
  GroupedTable,
  GroupedTableGroup,
} from "@bloom-housing/ui-components/src/tables/GroupedTable"
import t from "@bloom-housing/ui-components/src/helpers/translator"
import "./ListingsList.scss"

export interface ListingsProps {
  listings: Listing[]
}

const ListingsList = (props: ListingsProps) => {
  const listings = props.listings

  const listItems = listings.map((listing: Listing) => {
    const imageUrl = listing.imageUrl || ""
    const unitSummariesHeaders = {
      unitType: t("t.unitType"),
      minimumIncome: t("t.minimumIncome"),
      rent: t("t.rent"),
    }

    let unitSummaries = [] as GroupedTableGroup[]
    if (listing.unitsSummarized !== undefined) {
      unitSummaries = groupNonReservedAndReservedSummaries(
        listing.unitsSummarized.byNonReservedUnitType,
        listing.unitsSummarized.byReservedType
      )
    }

    return (
      <article key={listing.id} className="listings-row">
        <div className="listings-row_figure">
          <ImageCard
            title={listing.name}
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
                cellClassName="p-3"
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

export { ListingsList as default, ListingsList }
