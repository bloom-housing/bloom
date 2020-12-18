import * as React from "react"
import { Tag } from "./Tag"

export default {
  title: "Prototypes/Tag",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const standard = () => <Tag>Tag</Tag>

export const success = () => (
  <Tag success={true}>
    Success
  </Tag>
)

export const warning = () => (
  <Tag warning={true}>
    Warning
  </Tag>
)

export const small = () => (
  <Tag small={true}>
    Warning
  </Tag>
)

export const pill = () => (
  <Tag pillStyle={true}>
    Success
  </Tag>
)

export const PillAndSuccess = () => (
  <Tag pillStyle={true} success={true}>
    Pill Success
  </Tag>
)
