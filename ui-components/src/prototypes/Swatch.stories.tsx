import React from "react"
import { Swatch } from "./Swatch"

export default {
  title: "Prototypes/Swatch",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => {
  return (
    <>
      <Swatch colorVar={""} />
      <Swatch colorVar={"--bloom-color-primary"} />
      <Swatch colorVar={"--bloom-color-success"} />
      <Swatch colorVar={"--bloom-color-alert"} />
    </>
  )
}
