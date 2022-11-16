import React from "react"
import { PhoneMask } from "./PhoneMask"

export default {
  title: "Forms/Phone Mask",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}
export const Default = () => <PhoneMask />
