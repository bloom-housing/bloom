import * as React from "react"

import { ListingsGroup } from "./ListingsGroup"
import Archer from "@bloom-housing/listings-service/listings/archer.json"
import Triton from "@bloom-housing/listings-service/listings/triton-test.json"
import { Listing } from "@bloom-housing/core"

export default {
  title: "Listing/Listing Group",
}

const archer = Object.assign({}, Archer) as any
const triton = Object.assign({}, Triton) as any
const listings = [archer, triton] as Listing[]

export const showListingsGroup = () => {
  return (
    <ListingsGroup
      listings={listings}
      header="Header"
      showButtonText="Show"
      hideButtonText="Hide"
    />
  )
}
