import * as React from "react"
import { ExpandableSection } from "./ExpandableSection"

export default {
  title: "Listing Sidebar/Expandable Section",
  component: ExpandableSection,
}

export const Default = () => {
  return (
    <ExpandableSection
      content={"Main content"}
      strings={{
        title: "Title",
        readMore: "read more",
        readLess: "read less",
      }}
    />
  )
}

export const ExpandableMarkdown = () => {
  return (
    <ExpandableSection
      content={"Main content"}
      expandableContent={
        "<ul className='list-disc ml-6'><li>List #1</li><li>List #2</li><li>List #3</li></ul>"
      }
      strings={{
        title: "Title",
        readMore: "read more",
        readLess: "read less",
      }}
    />
  )
}
