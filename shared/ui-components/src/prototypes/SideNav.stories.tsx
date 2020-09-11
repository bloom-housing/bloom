import React from "react"

import "./SideNav.scss"

export default {
  title: "Prototypes/SideNav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const SideNav = () => (
  <nav className="side-nav" aria-label="Secondary navigation">
    <ul>
      <li><a href="#">One</a></li>
      <li><a href="#">Two</a></li>
      <li><a href="#">Three</a></li>
    </ul>
  </nav>
)

export const SideNavCurrent = () => (
  <nav className="side-nav" aria-label="Secondary navigation">
    <ul>
      <li><a href="#" className="is-current">One</a></li>
      <li><a href="#">Two</a></li>
      <li><a href="#">Three</a></li>
    </ul>
  </nav>
)
