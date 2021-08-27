import * as React from "react"

import { ListingsGroup } from "./ListingsGroup"

export default {
  title: "Listing/Listings Group",
}

export const showListingsGroup = () => {
  return (
    <ListingsGroup
      listingsCount={2}
      header="Header"
      showButtonText="Show"
      hideButtonText="Hide"
      info={"Info Text"}
    >
      Listings Go Here
    </ListingsGroup>
  )
}
