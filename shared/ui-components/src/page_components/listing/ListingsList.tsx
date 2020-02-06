import * as React from "react"
import ImageCard from "../../cards/ImageCard"
import { Listing } from "@bloom-housing/core/src/listings"
import LinkButton from "../../atoms/LinkButton"
import { groupNonReservedAndReservedSummaries } from "../../helpers/tableSummaries"
import { GroupedTable } from "@bloom-housing/ui-components/src/tables/GroupedTable"
import t from "@bloom-housing/ui-components/src/helpers/translator"

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
      rent: t("t.rent")
    }

    let unitSummaries = []
    if (listing.unitsSummarized !== undefined) {
      unitSummaries = groupNonReservedAndReservedSummaries(
        listing.unitsSummarized.byNonReservedUnitType,
        listing.unitsSummarized.byReservedType
      )
    }

    return (
      <article key={listing.id} className="flex flex-row flex-wrap max-w-5xl m-auto mb-12">
        <div className="w-full md:w-6/12 p-3">
          <ImageCard
            title={listing.name}
            imageUrl={imageUrl}
            href={`listing/id=${listing.id}`}
            as={`/listing/${listing.id}`}
            date={listing.applicationDueDate}
          />
        </div>
        <div className="w-full md:w-6/12 p-3">
          <h4 className="font-alt-sans font-semibold text-gray-900 text-base mb-2">
            {t("listings.openWaitlist")}
          </h4>
          <div className="mb-4">
            {unitSummaries && (
              <GroupedTable
                headers={unitSummariesHeaders}
                data={unitSummaries}
                responsiveCollapse={true}
                cellClassName="p-3"
              />
            )}
          </div>
          <LinkButton href={`listing/id=${listing.id}`} as={`/listing/${listing.id}`}>
            See Details
          </LinkButton>
        </div>
      </article>
    )
  })

  return <>{listItems}</>
}

export default ListingsList
