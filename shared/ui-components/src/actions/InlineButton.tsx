import * as React from "react"
import "./InlineButton.scss"

export interface InlineButtonProps {
  children: React.ReactNode
  className?: string
  arrow?: boolean
  onClick: (e: React.MouseEvent) => void
}

const InlineButton = (props: InlineButtonProps) => {
  const buttonClasses = ["inline-button"]
  if (props.className) buttonClasses.push(props.className)

  return (
    <button className={buttonClasses.join(" ")} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export { InlineButton as default, InlineButton }
