import React, { useMemo, useState } from "react"
import { LocalizedLink } from "../actions/LocalizedLink"
import { ApplicationStatus } from "../notifications/ApplicationStatus"
import "./ImageCard.scss"
import { Tag } from "../text/Tag"
import { TooltipProps } from "./Tooltip"
import { ApplicationStatusType } from "../global/ApplicationStatusType"
import { AppearanceStyleType } from "../global/AppearanceTypes"
import { t } from "../helpers/translator"
import { Icon, IconFillColors, UniversalIconType } from "../icons/Icon"
import { Modal } from "../overlays/Modal"
import { Button } from "../actions/Button"

export interface StatusBarType {
  status?: ApplicationStatusType
  content: string
  subContent?: string
  hideIcon?: boolean
  iconType?: UniversalIconType
}

export interface ImageTag {
  text?: string
  iconType?: UniversalIconType
  iconColor?: string
  styleType?: AppearanceStyleType
  tooltip?: ImageTagTooltip
}

export type ImageTagTooltip = Pick<TooltipProps, "id" | "text">

export interface ImageItem {
  url: string
  description?: string
  thumbnailUrl?: string
  mobileUrl?: string
}

export interface ImageCardProps {
  /** A description of the image, used as alt text */
  description?: string
  /** A link, used to wrap the entire component */
  href?: string
  /** An image URL, used as the main image */
  imageUrl?: string
  /** Alternatively, a number of images can be passed in  */
  images?: ImageItem[]
  /** A list of status indicators, an ApplicationStatus component is rendered for each item at the bottom of the card */
  statuses?: StatusBarType[]
  /** A list of image tags, a Tag component is rendered for each over the image */
  tags?: ImageTag[]
  /** The label text of the close button when the gallery modal is displayed */
  modalCloseLabel?: string
  /** The title text of the gallery modal, only for screen readers */
  modalAriaTitle?: string
  /** The label of the more images area of the images grid  */
  moreImagesLabel?: string
  /** The aria label of the clickable region of the images grid */
  moreImagesDescription?: string
}

/**
 * @component ImageCard
 *
 * A component that renders an image with optional tags at top and status bars below it
 */
const ImageCard = (props: ImageCardProps) => {
  const [showModal, setShowModal] = useState(false)

  const getStatuses = () => {
    return props.statuses?.map((status, index) => {
      return (
        <aside className="image-card__status" aria-label={status.content} key={index}>
          <ApplicationStatus
            status={status.status}
            content={status.content}
            subContent={status.subContent}
            withIcon={!status.hideIcon}
            iconType={status.iconType}
            vivid
          />
        </aside>
      )
    })
  }

  const innerClasses = ["image-card__inner"]
  if (props.images && props.images.length > 1) {
    innerClasses.push("has-grid-layout")
    if (props.images.length > 3) {
      innerClasses.push("has-modal-overflow")
    } else {
      innerClasses.push(`has-${props.images.length}-images`)
    }
  }

  const displayedImages = useMemo(() => {
    return props.images?.slice(0, 3)
  }, [props.images])

  const image = (
    <>
      <div className="image-card">
        <div className="image-card-tag__wrapper">
          {props.tags?.map((tag, index) => {
            return (
              <React.Fragment key={index}>
                <Tag styleType={tag.styleType || AppearanceStyleType.warning}>
                  {tag.iconType && (
                    <Icon
                      size={"medium"}
                      symbol={tag.iconType}
                      fill={tag.iconColor ?? IconFillColors.primary}
                    />
                  )}
                  {tag.text}
                </Tag>
              </React.Fragment>
            )
          })}
        </div>
        <figure className={innerClasses.join(" ")}>
          {props.imageUrl ? (
            <img
              src={props.imageUrl}
              alt={props.description || t("listings.buildingImageAltText")}
            />
          ) : props.images && displayedImages ? (
            displayedImages.map((image, index) => (
              <img
                key={index}
                src={image.thumbnailUrl || image.mobileUrl || image.url}
                alt={
                  image.description
                    ? image.description
                    : `${props.description || ""} - photo ${index + 1}`
                }
              />
            ))
          ) : (
            <div className={"image-card__placeholder"} />
          )}
          {props.images && props.images.length > 1 && (
            <>
              {props.images && props.images.length > 3 && (
                <div className="image-card__more-images">
                  <Icon symbol="plus" size="xlarge" />
                  {props.moreImagesLabel && (
                    <span>
                      {props.images.length - 2} {props.moreImagesLabel}
                    </span>
                  )}
                </div>
              )}
              <button
                aria-label={
                  props.moreImagesDescription &&
                  `${props.images.length - 2} ${props.moreImagesDescription}`
                }
                data-test-id="open-modal-button"
                onClick={() => {
                  setShowModal(true)
                }}
              ></button>
            </>
          )}
        </figure>
        {getStatuses()}
      </div>
      {props.images && props.images.length > 1 && (
        <Modal
          open={showModal}
          title={props.modalAriaTitle || "Images"}
          scrollable={true}
          onClose={() => setShowModal(!showModal)}
          className="image-card__overlay"
          modalClassNames="image-card__gallery-modal"
          headerClassNames="sr-only"
          actions={[
            <Button onClick={() => setShowModal(!showModal)}>
              {props.modalCloseLabel || "Close"}
            </Button>,
          ]}
        >
          {props.images.map((image, index) => (
            <p key={index} className="mb-7">
              <picture>
                {image.mobileUrl && <source media="(max-width: 767px)" srcSet={image.mobileUrl} />}
                <img
                  src={image.url}
                  alt={
                    image.description
                      ? image.description
                      : `${props.description || ""} - photo ${index + 1}`
                  }
                />
              </picture>
            </p>
          ))}
        </Modal>
      )}
    </>
  )

  let card = image

  if (props.href) {
    card = (
      <LocalizedLink className="block" href={props.href}>
        {image}
      </LocalizedLink>
    )
  }

  return card
}

export { ImageCard as default, ImageCard }
