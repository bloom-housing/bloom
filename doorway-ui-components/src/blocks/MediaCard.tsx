import * as React from "react"
import "./MediaCard.scss"
import { Icon, UniversalIconType } from "@bloom-housing/ui-components"
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons"

export interface MediaCardProps {
  title: string
  subtitle?: string
  className?: string
  icon?: UniversalIconType
  handleClick: () => void
}

const MediaCard = (props: MediaCardProps) => {
  const wrapperClasses = ["media-card"]
  if (props.className) wrapperClasses.push(props.className)
  return (
    <div className={wrapperClasses.join(" ")}>
      <button
        onClick={props.handleClick}
        className={"media-card__header-container"}
        aria-label={"Launch video"}
      >
        <div className="media-card__header">
          <Icon symbol={props.icon ?? faCirclePlay} size="2xl" fill="white" />
        </div>
      </button>
      <div className="media-card__body">
        <button onClick={props.handleClick}>
          <h3 className="media-card__title">{props.title}</h3>
        </button>
        <div className={"media-card__subtitle"}>{props.subtitle}</div>
      </div>
    </div>
  )
}

export { MediaCard as default, MediaCard }
