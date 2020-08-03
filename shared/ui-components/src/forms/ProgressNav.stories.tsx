import React from "react"

import ProgressNav from "./ProgressNav"

export default {
  title: "Forms/ProgressNav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <ProgressNav
    currentPageStep={2}
    completedSteps={1}
    labels={["You", "Household", "Income", "Preferences", "Review"]}
  />
)
