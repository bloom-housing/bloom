import React from "react"
import { SideNav } from "./SideNav"

export default {
  title: "Navigation/SideNav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <SideNav
    navItems={[
      { label: "Nav Item 1", url: "#", current: false },
      { label: "Nav Item 2", url: "#", current: false },
      { label: "Nav Item 3", url: "#" },
    ]}
  />
)

export const Current = () => (
  <SideNav
    navItems={[
      { label: "Nav Item 1", url: "#", current: true },
      { label: "Nav Item 2", url: "#", current: false },
      { label: "Nav Item 3", url: "#", current: false },
    ]}
  />
)
