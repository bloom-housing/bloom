import React from "react"
import { AppearanceStyleType, t } from "@bloom-housing/ui-components"
import { AppearanceSizeType } from "../global/AppearanceTypes"
import { Tag } from "../text/Tag"

import "./StatusMessage.scss"

export interface StatusMessagesProps {
  lastTimestamp?: string
  children?: React.ReactNode
  strings?: {
    lastUpdated?: string
    statusHistory?: string
  }
}

export const StatusMessages = (props: StatusMessagesProps) => {
  if (React.Children.count(props.children) == 0) {
    return (
      <ul className="status-messages">
        {props.lastTimestamp && (
          <li className="status-message">
            <div className="status-message__note text-center">
              {props.strings?.lastUpdated ?? t("t.lastUpdated")}: {props.lastTimestamp}
            </div>
          </li>
        )}
      </ul>
    )
  } else {
    return (
      <>
        <h3 className="status-messages__title">
          {props.strings?.statusHistory ?? t("t.statusHistory")}
        </h3>
        <ul className="status-messages">{props.children}</ul>
      </>
    )
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
        <Tag pillStyle={true} styleType={props.style} size={AppearanceSizeType.small}>
          {props.status}
        </Tag>

        <span className="status-message__time">{props.timestamp}</span>
      </div>

      {props.body && <div className="status-message__note">{props.body}</div>}
    </li>
  )
}

export { StatusMessage as default, StatusMessage }
