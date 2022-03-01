import React from "react"

import { ProgressNav } from "./ProgressNav"

export default {
  title: "Navigation/Progress Nav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <ProgressNav
    currentPageSection={2}
    completedSections={1}
    labels={["You", "Household", "Income", "Preferences", "Review"]}
    mounted={true}
  />
)
