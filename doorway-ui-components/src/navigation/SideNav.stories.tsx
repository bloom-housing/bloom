import React from "react"
import { BADGES } from "../../.storybook/constants"
import { StandardTable } from "../tables/StandardTable"
import { SideNav } from "./SideNav"
import { mockHeaders, mockData } from "../tables/StandardTable.stories"
import SideNavDocumentation from "./SideNav.docs.mdx"

export default {
  title: "Navigation/Side Nav 🚩",
  id: "navigation/side-nav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  parameters: {
    docs: {
      page: SideNavDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}

export const Default = () => (
  <div style={{ maxWidth: "275px" }}>
    <SideNav
      navItems={[
        { label: "Nav Item 1", url: "#", current: false },
        { label: "Nav Item 2", url: "#", current: false },
        { label: "Nav Item 3", url: "#" },
      ]}
    />
  </div>
)

export const Current = () => (
  <div style={{ maxWidth: "275px" }}>
    <SideNav
      navItems={[
        { label: "Nav Item 1", url: "#", current: true },
        { label: "Nav Item 2", url: "#", current: false },
        { label: "Nav Item 3", url: "#", current: false },
      ]}
    />
  </div>
)

const MultiLevelNav = () => (
  <SideNav
    navItems={[
      { label: "Nav Item 1", url: "#", current: false },
      {
        label: "Nav Item 2",
        url: "#",
        count: 10,
        childrenItems: [
          { label: "Child Item 1", url: "#", count: 7 },
          { label: "Child Item 2", url: "#", current: true, count: 3 },
        ],
      },
      { label: "Nav Item 3", url: "#" },
    ]}
  />
)

export const ChildItems = () => (
  <div style={{ maxWidth: "275px" }}>
    <MultiLevelNav />
  </div>
)

export const WithinLayout = () => (
  <div className="sidebar-detail-layout">
    <aside>
      <MultiLevelNav />
    </aside>
    <div className="rounded-lg border border-gray-500 overflow-hidden">
      <StandardTable headers={mockHeaders} data={mockData} />
    </div>
  </div>
)
