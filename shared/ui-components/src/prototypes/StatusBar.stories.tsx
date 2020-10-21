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
  <div className="status-bar grid grid-cols-4 gap-4">
    <div className="status-bar__note col-span-3"></div>
    <div className="status-bar__status">
      <Tag pillStyle={true}>
        Draft
      </Tag>
    </div>
  </div>
)

export const StatusBarSubmitted = () => (
  <div className="status-bar grid grid-cols-4 gap-4">
    <div className="status-bar__note col-span-3">Lottery ranking generated. 07/15/2020 at 11:45am <span className="status-bar__action"><a className="underline" href="#">Status History</a></span></div>

    <div className="status-bar__status">
      <Tag pillStyle={true} success={true}>
        Success
      </Tag>
    </div>
  </div>
)
