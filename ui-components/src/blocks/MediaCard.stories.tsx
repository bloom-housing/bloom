import * as React from "react"
import { MediaCard } from "./MediaCard"
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons"

export default {
  title: "Media Card 🚩",
  id: "blocks/media-card",
  decorators: [(storyFn: any) => <div style={{ maxWidth: "313px" }}>{storyFn()}</div>],
}

export const withIcon = () => (
  <MediaCard
    title="What is Affordable Housing?"
    subtitle="List of affordable housing opportunities, subsidized homes, and other housing resources."
    handleClick={() => alert("Open Video")}
    icon={faCirclePlay}
  />
)
export const withoutIcon = () => (
  <MediaCard
    title="What is Affordable Housing?"
    subtitle="List of affordable housing opportunities, subsidized homes, and other housing resources."
    handleClick={() => alert("Open Video")}
  />
)
