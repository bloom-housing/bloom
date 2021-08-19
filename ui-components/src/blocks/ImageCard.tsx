import * as React from "react"
import { LocalizedLink } from "../actions/LocalizedLink"
import { ApplicationStatus } from "../notifications/ApplicationStatus"
import "./ImageCard.scss"
import { Tag } from "../text/Tag"
import { ApplicationStatusType } from "../global/ApplicationStatusType"
import { AppearanceStyleType } from "../global/AppearanceTypes"
import { t } from "../helpers/translator"

export interface ImageCardProps {
  imageUrl: string
  subtitle?: string
  title: string
  href?: string
  description?: string
  tagLabel?: string
  appStatus?: ApplicationStatusType
  appStatusContent?: string
  appStatusSubContent?: string
}

const ImageCard = (props: ImageCardProps) => {
  let statusLabel
  let tag

  if (props.appStatus !== undefined && props.appStatusContent !== undefined) {
    statusLabel = (
      <aside className="image-card__status">
        <ApplicationStatus
          status={props.appStatus}
          content={props.appStatusContent}
          subContent={props.appStatusSubContent}
          vivid
        />
      </aside>
    )
  }

  if (props.tagLabel) {
    tag = (
      <div className="image-card-tag__wrapper">
        <Tag styleType={AppearanceStyleType.warning}>{props.tagLabel}</Tag>
      </div>
    )
  }

  const image = (
    <div className="image-card__wrapper">
      {tag}
      <figure className="image-card">
        {props.imageUrl && (
          <img src={props.imageUrl} alt={props.description || t("listings.buildingImageAltText")} />
        )}
        <figcaption className="image-card__figcaption">
          <h2 className="image-card__title">{props.title}</h2>
          {props.subtitle && <p className="image-card__subtitle">{props.subtitle}</p>}
        </figcaption>
      </figure>
      {statusLabel}
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
