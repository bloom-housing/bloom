import React from "react"

import "./BreadCrumbs.scss"

export default {
  title: "Prototypes/BreadCrumbs",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const BreadCrumbs = () => (
  <nav className="breadcrumbs" aria-label="Breadcrumbs">
    <ol>
      <li>
        <a href="#">One</a>
      </li>
      <li>
        <a href="#">Two</a>
      </li>
      <li aria-current="page">
        <span>Three</span>
      </li>
    </ol>
  </nav>
)