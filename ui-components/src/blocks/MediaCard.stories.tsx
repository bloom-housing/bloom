import * as React from "react"
import { MediaCard } from "./MediaCard"
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons"
import MediaCardDocumentation from "./MediaCard.docs.mdx"
import { BADGES } from "../../.storybook/constants"

export default {
  title: "Blocks/Media Card 🚩",
  id: "blocks/media-card",
  decorators: [(storyFn: any) => <div style={{ maxWidth: "313px" }}>{storyFn()}</div>],
  parameters: {
    docs: {
      page: MediaCardDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}

export const withTitleAndSubtitle = () => (
  <MediaCard
    title="What is Affordable Housing?"
    subtitle="List of affordable housing opportunities, subsidized homes, and other housing resources."
    handleClick={() => alert("Open Video")}
  />
)
export const withJustTitle = () => (
  <MediaCard title="What is Affordable Housing?" handleClick={() => alert("Open Video")} />
)
export const withCustomIcon = () => (
  <MediaCard
    title="What is Affordable Housing?"
    subtitle="List of affordable housing opportunities, subsidized homes, and other housing resources."
    icon={faCirclePlay}
    handleClick={() => alert("Open Video")}
  />
)
