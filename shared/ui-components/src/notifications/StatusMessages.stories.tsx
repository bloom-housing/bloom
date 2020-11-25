import React from "react"
import { AppearanceStyleType } from "../global/AppearanceTypes"
import { StatusMessages, StatusMessage } from "./StatusMessage"

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
