import * as React from "react"
import { MediaCard } from "./MediaCard"

export default {
  title: "Media Card 🚩",
  id: "blocks/media-card",
}

export const testing = () => (
  <MediaCard
    title="What is Affordable Housing?"
    subtitle="List of affordable housing opportunities, subsidized homes, and other housing resources."
    videoURL="https://www.youtube.com/embed/dw5s6rF7kxU"
  />
)
