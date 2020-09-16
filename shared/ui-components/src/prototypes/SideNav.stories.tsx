import React from "react"

import { SideNav } from "./SideNav"

export default {
  title: "Prototypes/SideNav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <SideNav>
    <li>
      <a href="#">One</a>
    </li>
    <li>
      <a href="#">Two</a>
    </li>
    <li>
      <a href="#">Three</a>
    </li>
  </SideNav>
)

export const Current = () => (
  <SideNav>
    <li>
      <a href="#" className="is-current">One</a>
    </li>
    <li>
      <a href="#">Two</a>
    </li>
    <li>
      <a href="#">Three</a>
    </li>
  </SideNav>
)
