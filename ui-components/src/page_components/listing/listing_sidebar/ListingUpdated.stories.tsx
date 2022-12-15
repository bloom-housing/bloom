import * as React from "react"
import ListingUpdated from "./ListingUpdated"

export default {
  title: "Listing Sidebar/Listing Updated",
  component: ListingUpdated,
}

export const Default = () => {
  return <ListingUpdated listingUpdated={new Date()} />
}
