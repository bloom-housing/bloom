import React from "react"

import { ListSection } from "./ListSection"

export default {
  title: "Sections/List Section",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => <ListSection title={"Title"} subtitle={"Subtitle"} />

export const Wrapped = () => (
  <ul>
    <ListSection title={"Title"} subtitle={"Subtitle"} />
  </ul>
)

export const WithChildren = () => (
  <ol>
    <ListSection title={"Title"} subtitle={"Subtitle"}>
      Children
    </ListSection>
  </ol>
)
