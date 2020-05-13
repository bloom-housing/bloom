import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import MultistepProgress from "./MultistepProgress"

export default {
  title: "Prototypes|MultistepProgress",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>]
}

export const Default = () => (
  <MultistepProgress currentPageStep={2} completedSteps={1} totalNumberOfSteps={5} label={}/>
)