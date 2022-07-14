import * as React from "react"
import { useState } from "react"
import "./MediaCard.scss"
import { Icon } from "../icons/Icon"
import { faCirclePlay } from "@fortawesome/free-regular-svg-icons"
import { Modal } from "../.."

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
  const [openMediaModal, setOpenMediaModal] = useState(false)
  const wrapperClasses = ["media-card"]
  if (props.className) {
    wrapperClasses.push(props.className)
  }
  return (
    <div className={wrapperClasses.join(" ")}>
      <div className="media-block">
        <div className="flex justify-center">
          <span onClick={() => setOpenMediaModal(true)} className={"cursor-pointer"}>
            <Icon symbol={faCirclePlay} size="2xl" fill="white" />
          </span>
        </div>
      </div>

      <div className="media-description">
        <a className="w-min" onClick={() => setOpenMediaModal(true)}>
          <h3 className="media-card__title">{props.title}</h3>
        </a>
        <div className={"media-card__subtitle"}>{props.subtitle}</div>
      </div>
      {openMediaModal && (
        <Modal
          open={openMediaModal}
          title={props.title ?? ""}
          onClose={() => setOpenMediaModal(!openMediaModal)}
          modalClassNames="media-modal"
          innerClassNames="media-modal-inner"
        >
          <iframe
            src={props.videoURL}
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={props.title}
          />
        </Modal>
      )}
    </div>
  )
}

export { MediaCard as default, MediaCard }
