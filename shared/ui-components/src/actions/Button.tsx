import * as React from "react"
import "./Button.scss"
import { AppearanceProps, classNamesForAppearanceTypes } from "../global/AppearanceTypes"
import { Icon } from "../icons/Icon"

export interface ButtonProps extends AppearanceProps {
  id?: string
  children: React.ReactNode
  onClick: (e: React.MouseEvent) => void
  icon?: string
  inline?: boolean
  unstyled?: boolean
  fullWidth?: boolean
  className?: string
  disabled?: boolean
}

export const buttonClassesForProps = (props: Omit<ButtonProps, "onClick">) => {
  const classNames = ["button"].concat(classNamesForAppearanceTypes(props))
  if (props.inline) classNames.push("is-inline")
  if (props.unstyled) classNames.push("is-unstyled")
  if (props.fullWidth) classNames.push("is-fullwidth")
  if (props.className) classNames.push(props.className)
  return classNames
}

const Button = (props: ButtonProps) => {
  const buttonClasses = buttonClassesForProps(props)

  let buttonInner = <></>
  if (props.icon) {
    buttonInner = (
      <>
        <Icon className="button__icon" size="tiny" symbol={props.icon} />
        <span className="button__content">{props.children}</span>
      </>
    )
  } else {
    buttonInner = <>{props.children}</>
  }

  return (
    <button
      id={props.id}
      className={buttonClasses.join(" ")}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {buttonInner}
    </button>
  )
}

export { Button as default, Button }
