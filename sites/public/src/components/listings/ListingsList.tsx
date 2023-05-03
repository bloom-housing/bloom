import * as React from "react"
import { getListings } from "../../lib/helpers"
import { Listing } from "@bloom-housing/backend-core"

type ListingsListProps = {
  listings: Listing[]
}

const ListingsList = (props: ListingsListProps) => {
  return <div className="listingsList">{getListings(props.listings)}</div>
}
export { ListingsList as default, ListingsList }
