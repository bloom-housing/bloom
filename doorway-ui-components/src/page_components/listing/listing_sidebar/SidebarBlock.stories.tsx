import * as React from "react"
import { SidebarBlock } from "./SidebarBlock"

export default {
  title: "Listing Sidebar/Sidebar Block",
  component: SidebarBlock,
}

export const Default = () => {
  return (
    <SidebarBlock title={"Title"}>
      <p>Content Paragraph 1</p>
      <p>Content Paragraph 2</p>
      <ul className={"list-disc ml-6"}>
        <li>First</li>
        <li>Second</li>
        <li>Third</li>
      </ul>
    </SidebarBlock>
  )
}

export const Styled = () => {
  return (
    <SidebarBlock title={"Title"} styleType={"capsWeighted"} className={"bg-blue-100"}>
      Content
    </SidebarBlock>
  )
}
