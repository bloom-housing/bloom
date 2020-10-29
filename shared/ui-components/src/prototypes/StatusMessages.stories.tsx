import React from "react"
import { Tag } from "./Tag"

import "./StatusMessages.scss"

export default {
  title: "Prototypes/StatusMessages",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const handleClick = (e: React.MouseEvent) => {
  alert(`You clicked me! Event: ${e.type}`)
}

export const StatusMessages = () => (
  <ul className="status-messages">
    <li className="status-message">
      <div className="status-message__status">
        <Tag pillStyle={true} success={true} small={true}>
          Submitted
        </Tag>

        <span className="status-message__time">
         01/01/21
        </span>
      </div>

      <div className="status-message__note">Changed status of one application.</div>
    </li>
    <li className="status-message">
      <div className="status-message__status">
        <Tag pillStyle={true} small={true}>
          Draft
        </Tag>

        <span className="status-message__time">
         01/01/21
        </span>
      </div>
    </li>
  </ul>
)

export const StatusMessagesBlank = () => (
  <ul className="status-messages">
    <li className="status-message">
      <div className="status-message__note text-center">Last Updated: August 1, 2020</div>
    </li>
  </ul>
)
