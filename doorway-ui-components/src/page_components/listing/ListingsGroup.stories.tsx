import * as React from "react"

import { ListingsGroup } from "./ListingsGroup"

export default {
  title: "Listing/Listings Group",
}

export const listingsGroup = () => {
  return (
    <ListingsGroup listingsCount={2} header="Header" showButtonText="Show" hideButtonText="Hide">
      Listings Go Here
    </ListingsGroup>
  )
}

export const listingsGroupWithInfo = () => {
  return (
    <ListingsGroup
      listingsCount={2}
      header="Header"
      showButtonText="Show"
      hideButtonText="Hide"
      info={"You can now check lottery results on the remaining listings."}
    >
      Listings Go Here
    </ListingsGroup>
  )
}

export const listingsGroupWithInfoLongButton = () => {
  return (
    <ListingsGroup
      listingsCount={2}
      header="Additional Listings"
      showButtonText="Show Additional Listings"
      hideButtonText="Hide Additional Listings"
      info={
        "We know you may have options about how many people will live with you. Here are listings for other household sizes and income levels."
      }
    >
      Listings Go Here
    </ListingsGroup>
  )
}

export const listingsGroupWithCustomIcon = () => {
  return (
    <ListingsGroup
      listingsCount={2}
      header="Additional Listings"
      showButtonText="Show Additional Listings"
      hideButtonText="Hide Additional Listings"
      info={
        "We know you may have options about how many people will live with you. Here are listings for other household sizes and income levels."
      }
      icon={"doubleHouse"}
    >
      Listings Go Here
    </ListingsGroup>
  )
}
