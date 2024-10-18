import React, { useMemo, useState } from "react"
import {
  t,
  AppearanceStyleType,
  Icon,
  IconFillColors,
  UniversalIconType,
  LocalizedLink,
  Tooltip,
  TooltipProps,
  Tag,
} from "@bloom-housing/ui-components"
import "./ImageCard.scss"
import { ApplicationStatusType } from "../global/ApplicationStatusType"
import { AppearanceSizeType } from "../global/AppearanceTypes"
import { Modal } from "../overlays/Modal"
import { Button } from "../actions/Button"
import { useFallbackImage } from "../helpers/useFallbackImage"

export interface StatusBarType {
  status?: ApplicationStatusType
  content: string
  subContent?: string
  hideIcon?: boolean
  iconType?: UniversalIconType
}

export type ImageTagTooltip = Pick<TooltipProps, "id" | "text">

export interface ImageTag {
  text?: string
  iconType?: UniversalIconType
  iconColor?: string
  styleType?: AppearanceStyleType
  tooltip?: ImageTagTooltip
}

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
  /** A fallback image URL that will be displayed on error for all images */
  fallbackImageUrl?: string
  /** A list of status indicators, an ApplicationStatus component is rendered for each item at the bottom of the card */
  statuses?: StatusBarType[]
  /** A list of image tags, a Tag component is rendered for each over the image */
  tags?: ImageTag[]
  /** When true, close button will be placed inside content section on desktop  */
  modalCloseInContent?: boolean
  /** The label text of the close button when the gallery modal is displayed */
  modalCloseLabel?: string
  /** The title text of the gallery modal, only for screen readers */
  modalAriaTitle?: string
  /** The label of the more images area of the images grid  */
  moreImagesLabel?: string
  /** The aria label of the clickable region of the images grid */
  moreImagesDescription?: string
  strings?: {
    defaultImageAltText?: string
  }
}

/**
 * @component ImageCard
 *
 * A component that renders an image with optional tags at top and status bars below it
 */
const ImageCard = (props: ImageCardProps) => {
  const [showModal, setShowModal] = useState(false)
  const { imgParentRef, imgRefs, onError } = useFallbackImage(props?.fallbackImageUrl)

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
        <figure className={innerClasses.join(" ")} ref={imgParentRef}>
          {props.imageUrl ? (
            <img
              src={props.imageUrl}
              alt={
                props.description ??
                props.strings?.defaultImageAltText ??
                t("listings.buildingImageAltText")
              }
              ref={(el) => (imgRefs.current[0] = el)}
              onError={onError}
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
                ref={(el) => (imgRefs.current[index] = el)}
                onError={onError}
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
                  props.moreImagesDescription
                    ? `${props.images.length - 2} ${props.moreImagesDescription}`
                    : "More Images"
                }
                data-testid="open-modal-button"
                onClick={() => {
                  setShowModal(true)
                }}
              ></button>
            </>
          )}
        </figure>
        <div className="image-card-tag__wrapper">
          {props.tags?.map((tag, index) => {
            const tagContent = (
              <Tag
                styleType={tag.styleType || AppearanceStyleType.warning}
                ariaLabel={
                  tag.tooltip ? `${tag.text || ""} - ${tag.tooltip?.text || ""}` : undefined
                }
              >
                {tag.iconType && (
                  <Icon
                    size={"medium"}
                    symbol={tag.iconType}
                    fill={tag.iconColor ?? IconFillColors.primary}
                    className={"mr-2"}
                  />
                )}
                {tag.text}
              </Tag>
            )

            if (tag.tooltip) {
              return (
                <Tooltip key={index} className="mt-3" {...tag.tooltip}>
                  {tagContent}
                </Tooltip>
              )
            }

            return <React.Fragment key={index}>{tagContent}</React.Fragment>
          })}
        </div>
      </div>
      {props.images && props.images.length > 1 && (
        <Modal
          open={showModal}
          title={props.modalAriaTitle || "Images"}
          scrollableModal={true}
          onClose={() => setShowModal(!showModal)}
          className="image-card__overlay"
          modalClassNames="image-card__gallery-modal"
          innerClassNames="image-card__inner-modal"
          headerClassNames="sr-only"
          closeIconColor={IconFillColors.white}
          actions={[
            <Button onClick={() => setShowModal(!showModal)} size={AppearanceSizeType.small}>
              {props.modalCloseLabel || "Close"}
            </Button>,
          ]}
          actionsInContent={props.modalCloseInContent}
        >
          {props.images?.map((image, index) => (
            <p key={index} className="md:mb-8">
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
