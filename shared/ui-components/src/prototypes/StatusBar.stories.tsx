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
    <div className="pr-2 mr-4 border-r border-gray-600">
      <span className="mr-2">Status:</span>
      <Tag pillStyle={true}>Draft</Tag>
    </div>
    <div>
      <span className="mr-4">Last Updated: August 1, 2020</span>
    </div>
    <Button small={true} filled={true} onClick={handleClick}>
      Save
    </Button>
  </div>
)

export const StatusBarSubmitted = () => (
  <div className="status-bar">
    <div className="pr-2 mr-4 border-r border-gray-600">
      <span className="mr-2">Status:</span>
      <Tag pillStyle={true} success={true}>
        Success
      </Tag>
    </div>
    <div>
      <span className="mr-4">Last Updated: August 1, 2020</span>
    </div>
    <Button small={true} onClick={handleClick}>
      Edit
    </Button>
  </div>
)
