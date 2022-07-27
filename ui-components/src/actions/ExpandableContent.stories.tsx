import * as React from "react"

import { ExpandableContent } from "./ExpandableContent"

export default {
  title: "Actions/Expandable Content",
}

const content = <div className={"mb-2"}>Sample Content</div>

export const standard = () => (
  <ExpandableContent strings={{ readMore: "read more", readLess: "read less" }}>
    {content}
  </ExpandableContent>
)
