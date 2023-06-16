import * as React from "react"
import "./Button.scss"
import { AppearanceProps, classNamesForAppearanceTypes } from "../global/AppearanceTypes"
import { Icon, IconSize, UniversalIconType } from "../icons/Icon"

export interface ButtonProps extends AppearanceProps {
  "data-testid"?: string
  ariaHidden?: boolean
  ariaLabel?: string
  children: React.ReactNode
  className?: string
  dataTestId?: string
  disabled?: boolean
  fullWidth?: boolean
  icon?: UniversalIconType
  iconClass?: string
  iconColor?: string
  iconPlacement?: "left" | "right"
  iconSize?: IconSize
  id?: string
  // TODO: inlineIcon is deprecated
  inline?: boolean
  inlineIcon?: "left" | "right"
  loading?: boolean
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
  passToIconClass?: string
  transition?: boolean
  type?: "button" | "submit" | "reset"
  unstyled?: boolean

  isActive?: boolean
  index?: number
  label?: string
  value?: string
  onSelect?: (index: number) => void
  onDeselect?: (index: number) => void
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
  if (props.transition) classNames.push("transition")
  if (props.isActive) classNames.push("is-secondary")
  return classNames
}

export const buttonInner = (props: Omit<ButtonProps, "onClick">) => {
  const iconSize = props.inline || props.inlineIcon ? "tiny" : "small"

  if (props.icon) {
    return props.inlineIcon == "left" || props.iconPlacement == "left" ? (
      <>
        <Icon
          className={`button__icon ${props.iconClass || ""}`}
          size={props.iconSize ?? iconSize}
          symbol={props.icon}
          iconClass={props.passToIconClass}
          fill={props.iconColor}
        />
        <span className="button__content">{props.children}</span>
      </>
    ) : (
      <>
        <span className="button__content">{props.children}</span>
        <Icon
          className={`button__icon ${props.iconClass || ""}`}
          size={props.iconSize ?? iconSize}
          symbol={props.icon}
          iconClass={props.passToIconClass}
          fill={props.iconColor}
        />
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

  const toggleState = () => {
    if (!props.onSelect || !props.onDeselect || typeof props.index != "number") {
      return
    }
    if (!props.isActive) {
      props.onSelect(props.index)
    } else {
      props.onDeselect(props.index)
    }
  }
  const keyDownHandler = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // TODO: keyboard-based navigation?
    if (event.charCode == 32) {
      toggleState()
    }
  }
  const onClickWrap = (event: React.MouseEvent<Element, MouseEvent>) => {
    toggleState()
    if (props.onClick) {
      props.onClick(event)
    }
  }

  return (
    <button
      id={props.id}
      type={props.type}
      className={buttonClasses.join(" ")}
      onClick={onClickWrap}
      disabled={props.disabled || props.loading}
      aria-hidden={props.ariaHidden}
      tabIndex={props.ariaHidden ? -1 : 0}
      aria-label={props.ariaLabel}
      data-testid={props.dataTestId || props["data-testid"]}
      onKeyDown={keyDownHandler}
    >
      {buttonInner(props)}
    </button>
  )
}

export { Button as default, Button }
