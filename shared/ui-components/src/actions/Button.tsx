import * as React from "react"
import "./Button.scss"
import {
  AppearanceStyleType,
  AppearanceSizeType,
  AppearanceBorderType,
} from "../global/AppearanceTypes"

export interface ButtonProps {
  id?: string
  children: React.ReactNode
  onClick: (e: React.MouseEvent) => void
  type?: AppearanceStyleType
  border?: AppearanceBorderType
  size?: AppearanceSizeType
  normalCase?: boolean
  unstyled?: boolean
  fullWidth?: boolean
  className?: string
}

export const buttonClassesForProps = (props: Omit<ButtonProps, "onClick">) => {
  const classNames = ["button"]
  if (props.type) classNames.push(props.type)
  if (props.border) classNames.push(props.border)
  if (props.size) classNames.push(props.size)
  if (props.normalCase) classNames.push("is-normal-case")
  if (props.unstyled) classNames.push("is-unstyled")
  if (props.fullWidth) classNames.push("is-fullwidth")
  if (props.className) classNames.push(props.className)
  return classNames
}

const Button = (props: ButtonProps) => {
  const buttonClasses = buttonClassesForProps(props)

  return (
    <button id={props.id} className={buttonClasses.join(" ")} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export { Button as default, Button }
