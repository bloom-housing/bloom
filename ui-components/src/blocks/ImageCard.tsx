import * as React from "react"
import { LocalizedLink } from "../actions/LocalizedLink"
import { ApplicationStatus } from "../notifications/ApplicationStatus"
import "./ImageCard.scss"
import { Tag } from "../text/Tag"
import { ApplicationStatusType } from "../global/ApplicationStatusType"
import { AppearanceStyleType } from "../global/AppearanceTypes"
import { t } from "../helpers/translator"
import { Icon, IconFillColors, IconTypes } from "../icons/Icon"
import { Tooltip, TooltipProps } from "../blocks/Tooltip"

export interface StatusBarType {
  status?: ApplicationStatusType
  content: string
  subContent?: string
  hideIcon?: boolean
  iconType?: IconTypes
}

export interface ImageTag {
  text?: string
  iconType?: IconTypes
  iconColor?: string
  styleType?: AppearanceStyleType
  tooltip?: ImageTagTooltip
}

export type ImageTagTooltip = Pick<TooltipProps, "id" | "text">

export interface ImageCardProps {
  description?: string
  href?: string
  imageUrl?: string
  statuses?: StatusBarType[]
  tags?: ImageTag[]
}

/**
 * @component ImageCard
 *
 * A component that renders an image with optional status bars below it
 *
 * @prop description - A description of the image, used as alt text
 * @prop href - A link, used to wrap the entire component
 * @prop imageUrl - An image URL, used as a background image
 * @prop statuses - A list of status indicators, an ApplicationStatus component is rendered for each item at the bottom of the card
 * @prop tags - A list of image tags, a Tag component is rendered for each over the image
 *
 */
const ImageCard = (props: ImageCardProps) => {
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

  const image = (
    <div className="image-card__wrapper">
      <div className="image-card-tag__wrapper">
        {props.tags?.map((tag, index) => {
          const tagContent = (
            <Tag
              tabIndex={0}
              styleType={tag.styleType ?? AppearanceStyleType.accentLight}
              className={"mt-3 me-2 ms-2 px-3 py-2"}
            >
              {tag.iconType && (
                <Icon
                  size={"medium"}
                  symbol={tag.iconType}
                  fill={tag.iconColor ?? IconFillColors.primary}
                  className={"me-2"}
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
      <figure className="image-card">
        {props.imageUrl ? (
          <img src={props.imageUrl} alt={props.description || t("listings.buildingImageAltText")} />
        ) : (
          <div className={"image-card__placeholder"} />
        )}
      </figure>
      {getStatuses()}
    </div>
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
