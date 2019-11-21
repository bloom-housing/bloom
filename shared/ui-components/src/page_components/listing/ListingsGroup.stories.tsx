import * as React from "react"
import { storiesOf } from "@storybook/react"
import ListingsGroup from "./ListingsGroup"
import Archer from "@bloom-housing/listings-service/listings/archer.json"
import Triton from "@bloom-housing/listings-service/listings/triton.json"
import { Listing } from "@bloom-housing/core/src/listings"
type AnyDict = { [key: string]: any }

const archer = Object.assign({}, Archer as AnyDict)
const triton = Object.assign({}, Triton as AnyDict)
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
      unitSummariesTable={[]}
    />
  )
  /* eslint-enable @typescript-eslint/ban-ts-ignore */
})
