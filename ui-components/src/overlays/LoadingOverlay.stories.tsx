import React from "react"
import SVG from "react-inlinesvg"
import { LoadingOverlay } from "./LoadingOverlay"

export default {
  title: "Overlays/Loading Overlay",
  decorators: [
    (storyFn: any) => (
      <div style={{ padding: "1rem" }}>
        {storyFn()}
        <SVG src="/images/icons.svg" />
      </div>
    ),
  ],
}

export const Default = () => (
  <LoadingOverlay isLoading={true}>
    <div style={{ backgroundColor: "green", color: "white", padding: "15em" }}>
      child content here
    </div>
  </LoadingOverlay>
)
