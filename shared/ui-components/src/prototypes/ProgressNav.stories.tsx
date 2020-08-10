import React from "react"

import { ProgressNav } from "./ProgressNav"

export default {
  title: "Prototypes/ProgressNav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => <ProgressNav />
