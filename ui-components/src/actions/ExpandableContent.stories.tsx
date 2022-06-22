import * as React from "react"
import { BADGES } from "../../.storybook/constants"
import { ExpandableContent } from "./ExpandableContent"

export default {
  title: "Actions/Expandable Content",
  badges: [BADGES.GEN2],
}

const content = <div>Sample Content</div>

export const standard = () => (
  <ExpandableContent strings={{ readMore: "read more", readLess: "read less" }}>
    {content}
  </ExpandableContent>
)
