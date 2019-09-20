import * as React from "react"
import LocalizedLink from "./LocalizedLink"

interface LinkButtonProps {
  href: string
  as?: string
  filled?: boolean
  normalCase?: boolean
  small?: boolean
  children: React.ReactNode
}

const LinkButton = (props: LinkButtonProps) => {
  // Style defined in @bloom/styles/src/atoms.scss
  const buttonClasses = ["button"]
  if (props.filled) buttonClasses.push("filled")
  if (props.normalCase) buttonClasses.push("normal-case")
  if (props.small) buttonClasses.push("small")

  const linkProps = {
    href: props.href,
    className: buttonClasses.join(" ")
  } as any

  if (props.as) linkProps.as = props.as

  return <LocalizedLink {...linkProps}>{props.children}</LocalizedLink>
}

export default LinkButton
