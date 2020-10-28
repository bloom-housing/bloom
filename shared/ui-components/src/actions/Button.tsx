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

export const buttonClassesForProps = (props: Omit<ButtonProps, "onClick">) => {
  const classNames = ["button"]
  if (props.filled) classNames.push("is-filled")
  if (props.normalCase) classNames.push("is-normal-case")
  if (props.small) classNames.push("is-small")
  if (props.big) classNames.push("is-big")
  if (props.className) classNames.push(props.className)
  return classNames
}

const Button = (props: ButtonProps) => {
  const buttonClasses = buttonClassesForProps(props)

  return (
    <button className={buttonClasses.join(" ")} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export { Button as default, Button }
