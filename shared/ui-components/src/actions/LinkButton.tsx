import * as React from "react"
import { LocalizedLink } from "./LocalizedLink"
import "./Button.scss"
import { buttonClassesForProps, buttonInner, ButtonProps } from "./Button"

export interface LinkButtonProps extends Omit<ButtonProps, "onClick"> {
  href: string
  as?: string
}

export interface LinkProps {
  href: string
  as?: string
  className?: string
}

const isExternalLink = (href: string) => {
  return href.startsWith("http")
}

const LinkButton = (props: LinkButtonProps) => {
  const buttonClasses = buttonClassesForProps(props)

  const linkProps = {
    href: props.href,
    className: buttonClasses.join(" "),
  } as LinkProps

  if (isExternalLink(props.href)) {
    return <a {...linkProps}>{buttonInner(props)}</a>
  } else {
    if (props.as) linkProps.as = props.as

    return <LocalizedLink {...linkProps}>{buttonInner(props)}</LocalizedLink>
  }
}

export { LinkButton as default, LinkButton }
