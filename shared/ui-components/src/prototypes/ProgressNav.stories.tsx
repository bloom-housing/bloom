import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import ProgressNav from "./ProgressNav"

export default {
  title: "Prototypes|ProgressNav",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => <ProgressNav />
