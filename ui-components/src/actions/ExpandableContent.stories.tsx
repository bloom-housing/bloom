import * as React from "react"
import { BADGES } from "../../.storybook/constants"
import { ExpandableContent } from "./ExpandableContent"
import ExpandableContentDocumentation from "./ExpandableContent.doc.mdx"

export default {
  title: "Actions/Expandable Content 🚩",
  id: "actions-expandable-content",
  parameters: {
    docs: {
      page: ExpandableContentDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}

const content = <div className={"mb-2"}>Sample Content</div>

export const standard = () => (
  <ExpandableContent strings={{ readMore: "read more", readLess: "read less" }}>
    {content}
  </ExpandableContent>
)
