import React from "react"
import { StatusMessages, StatusMessage } from "./StatusMessage"
import { AppearanceStyleType } from "@bloom-housing/ui-components"

export default {
  title: "Notifications/Status Messages",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const SeveralMessages = () => (
  <StatusMessages>
    <StatusMessage
      status="Submitted"
      style={AppearanceStyleType.success}
      timestamp="3/2/21"
      body="Additional details here."
    />
    <StatusMessage status="Draft" timestamp="2/1/21" />
  </StatusMessages>
)

export const NoMessages = () => <StatusMessages lastTimestamp="August 25, 2021"></StatusMessages>
