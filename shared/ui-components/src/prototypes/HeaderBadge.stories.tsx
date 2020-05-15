import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import HeaderBadge from "./HeaderBadge"

export default {
  title: "Prototypes|HeaderBadge",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const withIcon = () => <HeaderBadge />
