import React from "react"
import HeaderBadge from "./HeaderBadge"
import { withA11y } from "@storybook/addon-a11y"

export default {
  title: "PageComponents|HeaderBadge",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const withIcon = () => <HeaderBadge />
