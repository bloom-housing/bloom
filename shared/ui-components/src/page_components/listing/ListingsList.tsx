import * as React from "react"
import { Listing } from "../../types"
import ImageCard from "../../cards/image_card"
import LinkButton from "../../atoms/LinkButton"
import { BasicTable } from "@bloom/ui-components/src/tables/basic_table"
import t from "@bloom/ui-components/src/helpers/translator"

export interface ListingsProps {
  listings: Listing[]
  unitSummariesTable: any
}

const ListingsList = (props: ListingsProps) => {
  const listings = props.listings

  const listItems = listings.map(listing => {
    const imageUrl = listing.image_url || ""
    const unitSummariesHeaders = {
      unitType: t("t.unit_type"),
      minimumIncome: t("t.minimum_income"),
      rent: t("t.rent")
    }
    const unitSummaries = props.unitSummariesTable(listing)

    return (
      <article key={listing.id} className="flex flex-row flex-wrap max-w-5xl m-auto mb-12">
        <div className="w-full md:w-6/12 p-3">
          <ImageCard
            title={listing.name}
            imageUrl={imageUrl}
            href={`listing/id=${listing.id}`}
            as={`/listing/${listing.id}`}
            date={listing.application_due_date}
          />
        </div>
        <div className="w-full md:w-6/12 p-3">
          <h4 className="font-alt-sans font-semibold text-gray-900 text-base mb-2">
            {t("listings.open_waitlist")}
          </h4>
          <div className="mb-4">
            <BasicTable
              headers={unitSummariesHeaders}
              data={unitSummaries}
              responsiveCollapse={true}
              cellPadding="p-3"
            />
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
