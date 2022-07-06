import * as React from "react"
import OrDivider from "./OrDivider"
import { SidebarSection } from "./SidebarSection"

export default {
  title: "Listing Sidebar/Sidebar Section",
  component: SidebarSection,
}

export const Default = () => {
  return (
    <SidebarSection title={"Title"}>
      <p>Content Paragraph 1</p>
      <p>Content Paragraph 2</p>
      <ul className={"list-disc ml-6"}>
        <li>First</li>
        <li>Second</li>
        <li>Third</li>
      </ul>
    </SidebarSection>
  )
}

export const Styled = () => {
  return (
    <SidebarSection title={"Title"} titleStyle={"sidebarSubHeader"} className={"bg-blue-200"}>
      Content
    </SidebarSection>
  )
}
