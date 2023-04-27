import * as React from "react"
import { ListingWithSourceMetadata } from "../../../types/ListingWithSourceMetadata"
import { getListings } from "../../lib/helpers"

type ListingsListProps = {
  listings: ListingWithSourceMetadata[]
}

const ListingsList = (props: ListingsListProps) => {
  return <div className="listingsList">{getListings(props.listings)}</div>
}
export { ListingsList as default, ListingsList }
