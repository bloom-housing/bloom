import React from "react"
import { AppearanceSizeType, AppearanceStyleType } from "../global/AppearanceTypes"
import { Tag } from "../text/Tag"

export interface StatusMessagesProps {
  lastTimestamp?: string
  children?: React.ReactNode
}

export const StatusMessages = (props: StatusMessagesProps) => {
  if (React.Children.count(props.children) == 0) {
    return (
      <ul className="status-messages">
        {props.lastTimestamp && (
          <li className="status-message">
            <div className="status-message__note text-center">
              Last Updated: {props.lastTimestamp}
            </div>
          </li>
        )}
      </ul>
    )
  } else {
    return <ul className="status-messages">{props.children}</ul>
  }
}

export interface StatusMessageProps {
  status: string
  timestamp: string
  body?: string
  style?: AppearanceStyleType
}

const StatusMessage = (props: StatusMessageProps) => {
  return (
    <li className="status-message">
      <div className="status-message__status">
        <Tag pillStyle={true} type={props.style} size={AppearanceSizeType.small}>
          {props.status}
        </Tag>

        <span className="status-message__time">{props.timestamp}</span>
      </div>

      {props.body && <div className="status-message__note">{props.body}</div>}
    </li>
  )
}

export { StatusMessage as default, StatusMessage }
