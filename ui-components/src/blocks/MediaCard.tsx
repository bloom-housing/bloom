import * as React from "react"
import "./MediaCard.scss"
import { Icon, UniversalIconType } from "../icons/Icon"

export interface MediaCardProps {
  title?: string
  subtitle?: string
  className?: string
  icon?: UniversalIconType
  bgColor?: string
  clickFunction?: () => void
}

/**
 * @component MediaCard
 *
 * A component that renders an image with optional tags at top and status bars below it
 */
const MediaCard = (props: MediaCardProps) => {
  const wrapperClasses = ["media-card"]
  if (props.className) {
    wrapperClasses.push(props.className)
  }
  return (
    <div className={wrapperClasses.join(" ")}>
      <div className="media-block">
        {props.icon && (
          <div className="flex justify-center">
            <span onClick={props.clickFunction} className={"cursor-pointer"}>
              <Icon symbol={props.icon} size="2xl" fill="white" />
            </span>
          </div>
        )}
      </div>

      <div className="media-description">
        <a className="w-min" onClick={props.clickFunction}>
          <h3 className="media-card__title">{props.title}</h3>
        </a>
        <div className={"media-card__subtitle"}>{props.subtitle}</div>
      </div>
    </div>
  )
}

export { MediaCard as default, MediaCard }
