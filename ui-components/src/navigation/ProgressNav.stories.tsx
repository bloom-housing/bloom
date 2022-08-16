import React from "react"
import { BADGES } from "../../.storybook/constants"
import { ProgressNav } from "./ProgressNav"
import ProgressNavDocs from "./ProgressNav.docs.mdx"

export default {
  title: "Navigation/Progress Nav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  parameters: {
    docs: {
      page: ProgressNavDocs,
    },
    badges: [BADGES.GEN2],
  },
}

export const Default = () => (
  <ProgressNav
    currentPageSection={2}
    completedSections={1}
    labels={["You", "Household", "Income", "Preferences", "Review"]}
    mounted={true}
  />
)

export const barStyle = () => (
  <ProgressNav
    currentPageSection={2}
    completedSections={1}
    labels={["You", "Household", "Income", "Preferences", "Review"]}
    mounted={true}
    style={"bar"}
  />
)
