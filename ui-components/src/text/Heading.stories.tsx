import * as React from "react"
import { BADGES } from "../../.storybook/constants"
import HeadingDocumentation from "./Heading.docs.mdx"
import { Heading } from "./Heading"

export default {
  title: "Text/Heading 🚩",
  id: "text/heading",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  parameters: {
    docs: {
      page: HeadingDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}
export const baseHeader = () => <Heading>Base Header</Heading>
export const styled = () => <Heading style={"underlineHeader"}>Underline Header</Heading>
export const styledCustomPriority = () => (
  <Heading style={"largeHeader"} priority={6}>
    Custom Priority - 6
  </Heading>
)
