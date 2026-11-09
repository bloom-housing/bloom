import React from "react"
import { StopLightMessage, StopLightMessageProps } from "./StopLightMessage"

const StopLightBanner = (props: StopLightMessageProps) => (
  <div role="status">
    <StopLightMessage {...props} />
  </div>
)

export { StopLightBanner }
