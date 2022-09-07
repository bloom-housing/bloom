import React from "react"
import { BADGES } from "../../.storybook/constants"
import HeadingGroup from "./HeadingGroup"
import HeadingGroupDocumentation from "./HeadingGroup.docs.mdx"

export default {
  title: "Headers/Heading Group 🚩",
  id: "headers/heading-group",
  parameters: {
    docs: {
      page: HeadingGroupDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}

export const withContent = () => (
  <div style={{ maxWidth: "700px" }}>
    <HeadingGroup
      headingPriority={2}
      heading="Household Maximum Income"
      subheading="To determine your eligibility for this property, choose your household size (include yourself in that calculation)."
    />
  </div>
)
