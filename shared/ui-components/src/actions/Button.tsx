import * as React from "react"
import "./Button.scss"

export interface ButtonProps {
  children: React.ReactNode
  onClick: (e: React.MouseEvent) => void
  primary?: boolean
  filled?: boolean
  secondary?: boolean
  success?: boolean
  alert?: boolean
  warning?: boolean
  small?: boolean
  big?: boolean
  normalCase?: boolean
  borderless?: boolean
  unstyled?: boolean
  fullWidth?: boolean
  className?: string
}

export const buttonClassesForProps = (props: Omit<ButtonProps, "onClick">) => {
  const classNames = ["button"]
  if (props.filled || props.primary) classNames.push("is-primary")
  if (props.secondary) classNames.push("is-secondary")
  if (props.success) classNames.push("is-success")
  if (props.alert) classNames.push("is-alert")
  if (props.warning) classNames.push("is-warning")
  if (props.small) classNames.push("is-small")
  if (props.big) classNames.push("is-big")
  if (props.normalCase) classNames.push("is-normal-case")
  if (props.borderless) classNames.push("is-borderless")
  if (props.unstyled) classNames.push("is-unstyled")
  if (props.fullWidth) classNames.push("is-fullwidth")
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
