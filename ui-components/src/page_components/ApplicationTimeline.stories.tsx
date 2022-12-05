import React from "react"
import { ApplicationTimeline } from "./ApplicationTimeline"

export default {
  title: "Page Components/Application Timeline",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => <ApplicationTimeline />
