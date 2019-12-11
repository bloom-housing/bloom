import * as React from "react"
import { storiesOf } from "@storybook/react"
import ListingsGroup from "./ListingsGroup"
import Archer from "@bloom-housing/listings-service/listings/archer.json"
import Triton from "@bloom-housing/listings-service/listings/triton.json"
import { Listing } from "@bloom-housing/core/src/listings"

const archer = Object.assign({}, Archer) as any
const triton = Object.assign({}, Triton) as any
const listings = [archer, triton] as Listing[]

storiesOf("ListingsGroup", module).add("show listings group", () => {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return (
    <ListingsGroup
      listings={listings}
      header="Header"
      showButtonText="Show"
      hideButtonText="Hide"
    />
  )
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
})
