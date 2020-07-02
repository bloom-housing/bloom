import * as React from "react"
import LocalizedLink from "./LocalizedLink"
import "./Button.scss"

interface LinkButtonProps {
  href: string
  as?: string
  big?: boolean
  filled?: boolean
  normalCase?: boolean
  small?: boolean
  className?: string
  children: React.ReactNode
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
  const buttonClasses = ["button"]
  if (props.filled) buttonClasses.push("is-filled")
  if (props.normalCase) buttonClasses.push("is-normal-case")
  if (props.small) buttonClasses.push("is-small")
  if (props.big) buttonClasses.push("is-big")
  if (props.className) buttonClasses.push(props.className)

  const linkProps = {
    href: props.href,
    className: buttonClasses.join(" "),
  } as LinkProps

  if (isExternalLink(props.href)) {
    return <a {...linkProps}>{props.children}</a>
  } else {
    if (props.as) linkProps.as = props.as

    return <LocalizedLink {...linkProps}>{props.children}</LocalizedLink>
  }
}

export { LinkButton as default, LinkButton }
