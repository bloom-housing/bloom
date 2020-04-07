import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import ImageCard from "./ImageCard"

export default {
  title: "Cards|ImageCard",
  decorators: [withA11y, (storyFn: any) => <div style={{ maxWidth: "700px" }}>{storyFn()}</div>],
}

export const imageAndTitle = () => <ImageCard imageUrl="/images/listing.jpg" title="Hello World" />

export const withLink = () => (
  <ImageCard href="/listings" as="/listings" imageUrl="/images/listing.jpg" title="Hello World" />
)
