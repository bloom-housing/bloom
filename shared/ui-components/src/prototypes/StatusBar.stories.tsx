import React from "react"
import { Tag } from "./Tag"
import { Button } from "../actions/Button"

import "./StatusBar.scss"

export default {
  title: "Prototypes/StatusBar",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const handleClick = (e: React.MouseEvent) => {
  alert(`You clicked me! Event: ${e.type}`)
}

export const StatusBar = () => (
  <div className="status-bar">
    <div className="status-bar__status justify-self-end">
      <Tag pillStyle={true}>
        Draft
      </Tag>
    </div>
  </div>
)

export const StatusBarSubmitted = () => (
  <div className="status-bar justify-between">
    <div className="status-bar__note">Last Updated: August 1, 2020</div>

    <div className="status-bar__status">
      <Tag pillStyle={true} success={true}>
        Success
      </Tag>
    </div>
  </div>
)
