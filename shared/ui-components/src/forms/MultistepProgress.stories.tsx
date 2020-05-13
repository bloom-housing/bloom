import React from "react"
import { withA11y } from "@storybook/addon-a11y"

export default {
  title: "Prototypes|MultistepProgress",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>]
}

export const MultistepProgress = () => (
  <MultistepProgress />
)