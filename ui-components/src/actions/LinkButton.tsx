import React, { useContext } from "react"
import "./Button.scss"
import { buttonClassesForProps, buttonInner, ButtonProps } from "./Button"
import { LinkProps, NavigationContext } from "../config/NavigationContext"

export interface LinkButtonProps extends Omit<ButtonProps, "onClick"> {
  href: string
}

const isExternalLink = (href: string) => {
  return href.startsWith("http")
}

const LinkButton = (props: LinkButtonProps) => {
  const { linkComponent } = useContext(NavigationContext)
  const buttonClasses = buttonClassesForProps(props)

  if (isExternalLink(props.href)) {
    return (
      <a href={props.href} className={props.className}>
        {buttonInner(props)}
      </a>
    )
  } else {
    return React.createElement<LinkProps>(
      linkComponent,
      { href: props.href },
      <a className={buttonClasses.join(" ")}>{buttonInner(props)}</a>
    )
  }
}

export { LinkButton as default, LinkButton }
