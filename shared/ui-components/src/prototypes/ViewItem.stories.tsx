import React from "react"

import { ViewItem } from "./ViewItem"

export default {
  title: "Prototypes/ViewItem",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <ViewItem
    label="Label"
    value="Value"
    helper="Helper"
  />
)

export const NoHelper = () => (
  <ViewItem
    label="Address"
    value="1112 Springfield St."
  />
)

export const Flagged = () => (
  <ViewItem
    label="Address"
    value="1112 Springfield St."
    flagged={true}
  />
)