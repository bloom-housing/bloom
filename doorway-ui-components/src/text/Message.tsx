import * as React from "react"
import "./Message.scss"

export interface MessageProps {
  children: React.ReactNode
  warning?: boolean
}

const Message = (props: MessageProps) => {
  const messageClasses = ["message"]
  if (props.warning) messageClasses.push("is-warning")

  return <div className={messageClasses.join(" ")}>{props.children}</div>
}

export { Message as default, Message }
