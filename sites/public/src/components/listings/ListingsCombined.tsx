import * as React from "react"
import { Listing } from "@bloom-housing/backend-core/types"
import { ListingsMap } from "./ListingsMap"
import { ListingsList } from "./ListingsList"

type ListingsCombinedProps = {
  listings: Listing[]
  googleMapsApiKey: string
}
const parentStyle = {
  display: "flex",
  alignItems: "stretch",
  // This is a not-ideal way to do "fill window minus header+footer" however I can't find another way to do this.
  // TODO: update header+footer to a not-magic number
  height: "calc(100vh - 275px)",
}

const ListingsCombined = (props: ListingsCombinedProps) => (
  <div className="listings-combined" style={parentStyle}>
    <div style={{ flex: "1" }}>
      <ListingsMap listings={props.listings} googleMapsApiKey={props.googleMapsApiKey} />
    </div>
    <div style={{ overflowY: "auto", width: "600px" }}>
      <ListingsList listings={props.listings}></ListingsList>
    </div>
  </div>
)
export { ListingsCombined as default, ListingsCombined }
