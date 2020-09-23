import * as React from "react"
import { Flag } from "./Flag"

export default {
  title: "Prototypes/Flag",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const standard = () => <Flag>Flag</Flag>

export const small = () => (
  <Flag small={true}>
    Small
  </Flag>
)

export const warning = () => (
  <Flag warning={true}>
    Warning
  </Flag>
)

export const SmallAndWarning = () => (
  <Flag small={true} warning={true}>
    Small and Warning
  </Flag>
)
