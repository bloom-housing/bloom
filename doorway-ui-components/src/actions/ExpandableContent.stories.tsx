import * as React from "react"

import { ExpandableContent, Order } from "./ExpandableContent"

export default {
  title: "Actions/Expandable Content",
}

const content = <div className={"mb-2"}>Sample Content</div>

export const standard = () => (
  <ExpandableContent strings={{ readMore: "read more", readLess: "read less" }}>
    {content}
  </ExpandableContent>
)

export const below = () => (
  <ExpandableContent strings={{ readMore: "read more", readLess: "read less" }} order={Order.below}>
    {content}
  </ExpandableContent>
)
