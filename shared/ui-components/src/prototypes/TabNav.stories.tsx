import React from "react"

import { TabNav } from "./TabNav"

export default {
  title: "Prototypes/TabNav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <TabNav>
    <li>
      <a href="#" className="is-current">Applications</a>
    </li>
    <li>
      <a href="#">Flags</a>
    </li>
  </TabNav>
)

export const TabNavCount = () => (
  <TabNav>
    <li>
      <a href="#">Applications</a>
    </li>
    <li>
      <a href="#" className="is-current">Flags <span className="tag bg-gray-450 text-gray-900 ml-1">22</span></a>
    </li>
  </TabNav>
)
