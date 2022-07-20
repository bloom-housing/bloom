import * as React from "react"
import "./MediaCard.scss"
import { Icon, UniversalIconType } from "../icons/Icon"
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons"

export interface MediaCardProps {
  title: string
  subtitle?: string
  className?: string
  icon?: UniversalIconType
  handleClick?: () => void
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
      <div className="media-card__header">
        <div className="media-card__icon-container">
          <span onClick={props.handleClick}>
            <Icon symbol={props.icon ?? faCirclePlay} size="2xl" fill="white" />
          </span>
        </div>
      </div>

      <div className="media-card__body">
        <a onClick={props.handleClick}>
          <h3 className="media-card__title">{props.title}</h3>
        </a>
        <div className={"media-card__subtitle"}>{props.subtitle}</div>
      </div>
    </div>
  )
}

export { MediaCard as default, MediaCard }
