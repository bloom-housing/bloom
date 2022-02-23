import * as React from "react"
import { LocalizedLink } from "../actions/LocalizedLink"
import { ApplicationStatus } from "../notifications/ApplicationStatus"
import "./ImageCard.scss"
import { Tag } from "../text/Tag"
import { ApplicationStatusType } from "../global/ApplicationStatusType"
import { AppearanceStyleType } from "../global/AppearanceTypes"
import { t } from "../helpers/translator"
import { Icon, IconFillColors, IconTypes } from "../icons/Icon"

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
}

export interface ImageCardProps {
  imageUrl?: string
  subtitle?: string
  title: string
  href?: string
  description?: string
  tags?: ImageTag[]
  statuses?: StatusBarType[]
}

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
          return (
            <React.Fragment key={index}>
              <Tag styleType={AppearanceStyleType.warning} className={"mt-3 mr-2 ml-2"}>
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
            </React.Fragment>
          )
        })}
      </div>
      <figure className="image-card">
        {props.imageUrl ? (
          <img src={props.imageUrl} alt={props.description || t("listings.buildingImageAltText")} />
        ) : (
          <div className={"image-card__placeholder"} />
        )}
        <div className={"image-card__overlay"} />
        <figcaption className="image-card__figcaption">
          <h2 className="image-card__title">{props.title}</h2>
          {props.subtitle && <p className="image-card__subtitle">{props.subtitle}</p>}
        </figcaption>
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
