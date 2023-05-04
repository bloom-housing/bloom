import React from "react"

import "./Back.scss"

export default {
  title: "Prototypes/Back",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Back = () => (
  <span className="back">
    <a href="#">Back</a>
  </span>
)
