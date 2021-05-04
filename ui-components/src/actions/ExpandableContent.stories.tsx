import * as React from "react"

import { ExpandableContent } from "./ExpandableContent"

export default {
  title: "Actions/Expandable Content",
}

const content = <div>Sample Content</div>

export const standard = () => <ExpandableContent>{content}</ExpandableContent>
