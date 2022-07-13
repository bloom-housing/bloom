import * as React from "react"
import "./MediaCard.scss"

export interface MediaCardProps {
  title?: string
  videoURL?: string
  subtitle?: string
  //   externalHref?: string
  className?: string
  children?: React.ReactNode
}

/**
 * @component MediaCard
 *
 * A component that renders an image with optional tags at top and status bars below it
 */
const MediaCard = (props: MediaCardProps) => {
  // <div className="media-card">

  // </div>
  const wrapperClasses = ["media-card"]
  if (props.className) {
    wrapperClasses.push(props.className)
  }
  return (
    <div className={wrapperClasses.join(" ")}>
      <iframe
        src={props.videoURL}
        frameBorder="0"
        allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={props.title}
      />
      <div className="media-container"></div>
      <div>
        <h3 className="info-card__title">{props.title}</h3>
        {props.subtitle && <span className={"text-sm text-gray-700"}>{props.subtitle}</span>}
      </div>
    </div>
  )
}

export { MediaCard as default, MediaCard }
