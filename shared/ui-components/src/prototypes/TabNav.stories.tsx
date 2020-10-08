import React from "react"
import { Tag } from "./Tag"
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
      <a href="#" className="is-current">Flags 
        <Tag 
         pillStyle={true}>
          22
        </Tag>
      </a>
    </li>
  </TabNav>
)
