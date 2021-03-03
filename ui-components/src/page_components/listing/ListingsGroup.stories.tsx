import * as React from "react"

import { ListingsGroup } from "./ListingsGroup"
import Archer from "../../../__tests__/fixtures/archer.json"
import Triton from "../../../__tests__/fixtures/triton-test.json"
import { Listing } from "@bloom-housing/backend-core/types"

export default {
  title: "Listing/Listing Group",
}

const archer = Object.assign({}, Archer) as any
const triton = Object.assign({}, Triton) as any
archer.property = {}
archer.property.unitsSummarized = {}
archer.property.unitsSummarized.byNonReservedUnitType = []
archer.property.unitsSummarized.byReservedType = []

triton.property = {}
triton.property.unitsSummarized = {}
triton.property.unitsSummarized.byNonReservedUnitType = []
triton.property.unitsSummarized.byReservedType = []
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
