import * as React from "react"
import "./MediaCard.scss"
import { Icon } from "../icons/Icon"
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons"
import { useState } from "@storybook/addons"

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
  const [openMediaModal, setOpenMediaModal] = useState<boolean>(false)
  const wrapperClasses = ["media-card"]
  if (props.className) {
    wrapperClasses.push(props.className)
  }
  return (
    <div className={wrapperClasses.join(" ")}>
      <div className="media-block">
        <div onClick={() => console.log("testing")}>
          <Icon symbol={faCirclePlay} size="2xl" className="flex justify-center" fill="white" />
        </div>
      </div>
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
