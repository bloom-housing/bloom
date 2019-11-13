import * as React from "react"
import { storiesOf } from "@storybook/react"
import Apply from "./Apply"
import Archer from "@bloom-housing/listings-service/listings/archer.json"

const listing = Object.assign({}, Archer)

storiesOf("Listing|Sidebar Apply", module).add("hard application deadline", () => (
  // @ts-ignore
  <Apply listing={listing} />
))
