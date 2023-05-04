import React from "react"

import { ViewItem } from "./ViewItem"

export default {
  title: "Blocks/View Item",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => <ViewItem label="Label" children="Value" helper="Helper" />

export const NoHelper = () => <ViewItem label="Address" children="1112 Springfield St." />

export const Flagged = () => (
  <ViewItem label="Address" children="1112 Springfield St." flagged={true} />
)
