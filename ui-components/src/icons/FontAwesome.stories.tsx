import React from "react"
import { Icon } from "./Icon"
import { faAlignCenter, faForwardStep, faHandsClapping } from "@fortawesome/free-solid-svg-icons"

export default {
  title: "Icons/FontAwesome Examples",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const IconAlignCenter = () => <Icon symbol={faAlignCenter} size="large" />
export const IconForwardStep = () => <Icon symbol={faForwardStep} size="large" fill="#2277CC" />
export const IconHandsClapping = () => <Icon symbol={faHandsClapping} size="large" fill="#BB5511" />
