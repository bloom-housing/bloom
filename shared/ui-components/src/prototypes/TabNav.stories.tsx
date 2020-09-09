import React from "react"

import "./TabNav.scss"

export default {
  title: "Prototypes/TabNav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const TabNav = () => (
  <nav className="tab-nav" aria-label="Secondary navigation">
    <ul>
      <li><a href="#" className="is-current">Applications</a></li>
      <li><a href="#">Flags</a></li>
    </ul>
  </nav>
)

export const TabNavCount = () => (
  <nav className="tab-nav" aria-label="Secondary navigation">
    <ul>
      <li><a href="#">Applications</a></li>
      <li><a href="#" className="is-current">Flags <span className="tag bg-gray-450 text-gray-900 ml-1">22</span></a></li>
    </ul>
  </nav>
)