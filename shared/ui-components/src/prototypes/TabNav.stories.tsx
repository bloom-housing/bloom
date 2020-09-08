import React from "react"

import "./TabNav.scss"

export default {
  title: "Prototypes/TabNav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const TabNav = () => (
  <nav className="tab-nav">
    <ul>
      <li><a href="#">Applications</a></li>
      <li className="is-current"><a href="#">Flags <span className="pill bg-gray-450 text-gray-900">22</span></a></li>
    </ul>
  </nav>
)