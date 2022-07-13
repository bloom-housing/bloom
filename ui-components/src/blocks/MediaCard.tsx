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
      <div className="media-block" />
      <div className="media-description">
        <h3 className="media-card__title">{props.title}</h3>
        <div className={"media-card__subtitle"}>{props.subtitle}</div>
      </div>
    </div>
  )
}

// ;<iframe
//   src={props.videoURL}
//   frameBorder="0"
//   allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//   allowFullScreen
//   title={props.title}
// />

export { MediaCard as default, MediaCard }
