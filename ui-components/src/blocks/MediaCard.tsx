import * as React from "react"
import "./MediaCard.scss"
import { Icon, UniversalIconType } from "../icons/Icon"
import { background } from "@storybook/theming"

export interface MediaCardProps {
  title?: string
  subtitle?: string
  className?: string
  icon?: UniversalIconType
  handleClick?: () => void
  color?: string
}

/**
 * @component MediaCard
 *
 * A component that renders an image with optional tags at top and status bars below it
 */
const MediaCard = (props: MediaCardProps) => {
  const wrapperClasses = ["media-card"]
  if (props.className) wrapperClasses.push(props.className)
  return (
    <div className={wrapperClasses.join(" ")}>
      <div className="media-card__header" style={{ backgroundColor: props?.color }}>
        {props.icon && (
          <div className="flex justify-center">
            <span onClick={props.handleClick} className={"cursor-pointer"}>
              <Icon symbol={props.icon} size="2xl" fill="white" />
            </span>
          </div>
        )}
      </div>

      <div className="media-card__body">
        <a className="w-min" onClick={props.handleClick}>
          <h3 className="media-card__title" style={{ color: props?.color }}>
            {props.title}
          </h3>
        </a>
        <div className={"media-card__subtitle"}>{props.subtitle}</div>
      </div>
    </div>
  )
}

export { MediaCard as default, MediaCard }
