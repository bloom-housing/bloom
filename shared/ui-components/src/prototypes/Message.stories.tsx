import React from "react"

import "./Message.scss"

export default {
  title: "Prototypes/Message",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Message = () => (
  <div className="message">All units reserved for seniors 62+</div>
)

export const MessageWarn = () => (
  <div className="message is-warn">All units reserved for seniors 62+</div>
)