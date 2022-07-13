import * as React from "react"
import { BADGES } from "../../.storybook/constants"
import { MediaCard } from "./MediaCard"

export default {
  title: "Media Card 🚩",
  id: "blocks/media-card",
  decorators: [(storyFn: any) => <div style={{ maxWidth: "700px" }}>{storyFn()}</div>],
  parameters: {
    badges: [BADGES.GEN2],
  },
}

export const testing = () => (
  <MediaCard
    title="What is Affordable Housing?"
    subtitle="List of affordable housing opportunities, subsidized homes, and other housing resources."
    videoURL="https://www.youtube.com/embed/dQw4w9WgXcQ"
  />
)
