import React from "react"
import { LoadingOverlay } from "./LoadingOverlay"

export default {
  title: "Overlays/Loading Overlay",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <LoadingOverlay isLoading={true}>
    <div
      style={{
        backgroundColor: "green",
        color: "white",
        padding: "10em 1em 20em",
        textAlign: "center",
      }}
    >
      child content here
    </div>
  </LoadingOverlay>
)
