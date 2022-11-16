import React from "react"
import { LocalizedLink } from "./LocalizedLink"

export default {
  title: "Actions/Localized Link",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}
export const Default = () => <PhoneMask />
