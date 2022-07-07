import React, { useContext } from "react"
import "./Button.scss"
import { buttonClassesForProps, buttonInner, ButtonProps } from "./Button"
import { NavigationContext } from "../config/NavigationContext"
import { isExternalLink } from "../helpers/links"
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import { Icon } from "../icons/Icon"

export interface LinkButtonProps extends Omit<ButtonProps, "onClick"> {
  href: string
  dataTestId?: string
  newTab?: boolean
  newTabIcon?: boolean
}

const LinkButton = (props: LinkButtonProps) => {
  const { LinkComponent } = useContext(NavigationContext)
  const buttonClasses = buttonClassesForProps(props)

  if (isExternalLink(props.href)) {
    return (
      <a
        href={props.href}
        className={buttonClasses.join(" ")}
        data-test-id={props.dataTestId}
        target={props.newTab ? "_blank" : "_self"}
        aria-label={props.newTabIcon ? "Opens in a new tab" : ""}
      >
        {buttonInner(props)}
        {props.newTabIcon && (
          <Icon symbol={faUpRightFromSquare} size={"small"} className={"ml-2"} />
        )}
      </a>
    )
  } else {
    return (
      <LinkComponent
        href={props.href}
        aria-hidden={props.ariaHidden}
        className={buttonClasses.join(" ")}
        data-test-id={props.dataTestId}
      >
        {buttonInner(props)}
      </LinkComponent>
    )
  }
}

export { LinkButton as default, LinkButton }
