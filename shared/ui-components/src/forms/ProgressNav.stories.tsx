import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import ProgressNav from "./ProgressNav"

export default {
  title: "Forms|ProgressNav",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <ProgressNav
    currentPageStep={2}
    completedSteps={1}
    totalNumberOfSteps={5}
    labels={["You", "Household", "Income", "Preferences", "Review"]}
  />
)
