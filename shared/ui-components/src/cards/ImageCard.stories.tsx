import * as React from "react"

import ImageCard from "./ImageCard"

export default {
  title: "Cards/ImageCard",
  decorators: [(storyFn: any) => <div style={{ maxWidth: "700px" }}>{storyFn()}</div>],
}

export const imageAndTitle = () => <ImageCard imageUrl="/images/listing.jpg" title="Hello World" />

export const withLink = () => (
  <ImageCard href="/listings" as="/listings" imageUrl="/images/listing.jpg" title="Hello World" />
)
