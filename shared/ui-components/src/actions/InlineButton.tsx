import * as React from "react"
import "./InlineButton.scss"
import { Icon } from "@bloom-housing/ui-components"

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
      {props.arrow && <Icon className="inline-button__icon" size="tiny" symbol="arrow-back" />}
      <span className="inline-button__content">{props.children}</span>
    </button>
  )
}

export { InlineButton as default, InlineButton }
