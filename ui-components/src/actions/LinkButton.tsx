import * as React from "react"
import Link from "next/link"
import "./Button.scss"
import { buttonClassesForProps, buttonInner, ButtonProps } from "./Button"

export interface LinkButtonProps extends Omit<ButtonProps, "onClick"> {
  href: string
  as?: string
}

const isExternalLink = (href: string) => {
  return href.startsWith("http")
}

const LinkButton = (props: LinkButtonProps) => {
  const buttonClasses = buttonClassesForProps(props)

  if (isExternalLink(props.href)) {
    return (
      <a href={props.href} className={props.className}>
        {buttonInner(props)}
      </a>
    )
  } else {
    return (
      <Link href={props.href}>
        <a className={buttonClasses.join(" ")}>{buttonInner(props)}</a>
      </Link>
    )
  }
}

export { LinkButton as default, LinkButton }
