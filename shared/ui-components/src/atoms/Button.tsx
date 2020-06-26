import * as React from "react"
import "./Button.scss"

export interface ButtonProps {
  children: React.ReactNode
  className?: string
  big?: boolean
  filled?: boolean
  normalCase?: boolean
  onClick: (e: React.MouseEvent) => void
  small?: boolean
}

const Button = (props: ButtonProps) => {
  const buttonClasses = ["button"]
  if (props.filled) buttonClasses.push("is-filled")
  if (props.normalCase) buttonClasses.push("is-normal-case")
  if (props.small) buttonClasses.push("is-small")
  if (props.big) buttonClasses.push("is-big")
  if (props.className) buttonClasses.push(props.className)

  return (
    <button className={buttonClasses.join(" ")} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export { Button as default, Button }
