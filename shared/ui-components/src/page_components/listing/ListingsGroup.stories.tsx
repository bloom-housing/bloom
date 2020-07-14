import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import ListingsGroup from "./ListingsGroup"
import Archer from "@bloom-housing/listings-service/listings/archer.json"
import Triton from "@bloom-housing/listings-service/listings/triton-test.json"
import { Listing } from "@bloom-housing/core"

export default {
  title: "PageComponents|ListingGroup",
  decorators: [withA11y],
}

const archer = Object.assign({}, Archer) as any
const triton = Object.assign({}, Triton) as any
const listings = [archer, triton] as Listing[]

export const showListingsGroup = () => {
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
}
