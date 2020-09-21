import * as React from "react"
import { Tag } from "./Tag"

export default {
  title: "Prototypes/Tag",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const standard = () => <Tag>tag</Tag>

export const success = () => (
  <Tag success={true}>
    Warning
  </Tag>
)
