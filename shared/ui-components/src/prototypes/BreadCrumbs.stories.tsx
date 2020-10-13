import React from "react"

import { BreadCrumbs } from "./BreadCrumbs"

export default {
  title: "Prototypes/BreadCrumbs",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <BreadCrumbs>
    <li>
      <a href="#">One</a>
    </li>
    <li>
      <a href="#">Two</a>
    </li>
    <li aria-current="page">
      <span>Three</span>
    </li>
  </BreadCrumbs>
)
