import * as React from "react"
import "./Button.scss"
import { AppearanceProps, classNamesForAppearanceTypes } from "../global/AppearanceTypes"
import { Icon } from "../icons/Icon"

export interface ButtonProps extends AppearanceProps {
  id?: string
  type?: "button" | "submit" | "reset"
  children: React.ReactNode
  onClick: (e: React.MouseEvent) => void
  icon?: string
  inlineIcon?: "left" | "right"
  unstyled?: boolean
  fullWidth?: boolean
  className?: string
  disabled?: boolean
  loading?: boolean
}

export const buttonClassesForProps = (props: Omit<ButtonProps, "onClick">) => {
  const classNames = ["button"].concat(classNamesForAppearanceTypes(props))
  if (props.inlineIcon) {
    classNames.push("is-inline")
    classNames.push(`inline-icon--${props.inlineIcon}`)
  }
  if (props.unstyled) classNames.push("is-unstyled")
  if (props.fullWidth) classNames.push("is-fullwidth")
  if (props.className) classNames.push(props.className)
  if (props.loading) classNames.push("is-loading")
  return classNames
}

export const buttonInner = (props: Omit<ButtonProps, "onClick">) => {
  if (props.icon) {
    return props.inlineIcon == "left" ? (
      <>
        <Icon className="button__icon" size="tiny" symbol={props.icon} />
        <span className="button__content">{props.children}</span>
      </>
    ) : (
      <>
        <span className="button__content">{props.children}</span>
        <Icon className="button__icon" size="tiny" symbol={props.icon} />
      </>
    )
  } else if (props.loading) {
    return (
      <>
        <Icon className="button__loader" size="large" symbol="spinner" />
        <span className="button__content">{props.children}</span>
      </>
    )
  } else {
    return <>{props.children}</>
  }
}

const Button = (props: ButtonProps) => {
  const buttonClasses = buttonClassesForProps(props)

  return (
    <button
      id={props.id}
      type={props.type}
      className={buttonClasses.join(" ")}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
    >
      {buttonInner(props)}
    </button>
  )
}

export { Button as default, Button }
