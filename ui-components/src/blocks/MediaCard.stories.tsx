import * as React from "react"
import { MediaCard } from "./MediaCard"
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons"

export default {
  title: "Blocks/Media Card 🚩",
  id: "blocks/media-card",
  decorators: [(storyFn: any) => <div style={{ maxWidth: "313px" }}>{storyFn()}</div>],
}

export const withIconPrimary = () => (
  <MediaCard
    title="What is Affordable Housing?"
    subtitle="List of affordable housing opportunities, subsidized homes, and other housing resources."
    handleClick={() => alert("Open Video")}
    icon={faCirclePlay}
  />
)
export const withIconRed = () => (
  <MediaCard
    title="What is Affordable Housing?"
    subtitle="List of affordable housing opportunities, subsidized homes, and other housing resources."
    handleClick={() => alert("Open Video")}
    icon={faCirclePlay}
    color="red"
  />
)
export const withoutIcon = () => (
  <MediaCard
    title="What is Affordable Housing?"
    subtitle="List of affordable housing opportunities, subsidized homes, and other housing resources."
    handleClick={() => alert("Open Video")}
  />
)
