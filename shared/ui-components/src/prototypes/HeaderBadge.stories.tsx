import React from "react"

import { HeaderBadge } from "./HeaderBadge"

export default {
  title: "Prototypes/HeaderBadge",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const withIcon = () => <HeaderBadge />
