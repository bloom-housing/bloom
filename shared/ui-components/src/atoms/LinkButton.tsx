import * as React from "react"
import LocalizedLink from "./LocalizedLink"
import "./Button.scss"

interface LinkButtonProps {
  href: string
  as?: string
  filled?: boolean
  normalCase?: boolean
  small?: boolean
  className?: string
  children: React.ReactNode
}

interface LinkProps {
  href: string
  as?: string
  className?: string
}

const LinkButton = (props: LinkButtonProps) => {
  const buttonClasses = ["button"]
  if (props.filled) buttonClasses.push("filled")
  if (props.normalCase) buttonClasses.push("normal-case")
  if (props.small) buttonClasses.push("small")
  if (props.className) buttonClasses.push(props.className)

  const linkProps = {
    href: props.href,
    className: buttonClasses.join(" ")
  } as LinkProps

  if (props.as) linkProps.as = props.as

  return <LocalizedLink {...linkProps}>{props.children}</LocalizedLink>
}

export default LinkButton
