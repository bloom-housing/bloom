import * as React from "react"
import "./Button.scss"
import { AppearanceProps, classNamesForAppearanceTypes } from "../global/AppearanceTypes"
import { Icon, IconTypes } from "../icons/Icon"

export interface ButtonProps extends AppearanceProps {
  id?: string
  type?: "button" | "submit" | "reset"
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  icon?: IconTypes
  iconPlacement?: "left" | "right"
  // TODO: inlineIcon is deprecated
  inlineIcon?: "left" | "right"
  inline?: boolean
  unstyled?: boolean
  fullWidth?: boolean
  className?: string
  disabled?: boolean
  loading?: boolean
}

export const buttonClassesForProps = (props: Omit<ButtonProps, "onClick">) => {
  const classNames = ["button"].concat(classNamesForAppearanceTypes(props))
  const inline = props.inline || props.inlineIcon
  const iconPlacement = props.iconPlacement || props.inlineIcon || "right"

  if (props.inlineIcon || props.icon) classNames.push(`has-icon-${iconPlacement}`)
  if (inline) classNames.push("is-inline")
  if (props.unstyled) classNames.push("is-unstyled")
  if (props.fullWidth) classNames.push("is-fullwidth")
  if (props.className) classNames.push(props.className)
  if (props.loading) classNames.push("is-loading")
  return classNames
}

export const buttonInner = (props: Omit<ButtonProps, "onClick">) => {
  const iconSize = props.inline || props.inlineIcon ? "tiny" : "small"

  if (props.icon) {
    return props.inlineIcon == "left" || props.iconPlacement == "left" ? (
      <>
        <Icon className="button__icon" size={iconSize} symbol={props.icon} />
        <span className="button__content">{props.children}</span>
      </>
    ) : (
      <>
        <span className="button__content">{props.children}</span>
        <Icon className="button__icon" size={iconSize} symbol={props.icon} />
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
