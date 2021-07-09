import * as React from "react"
import { LocalizedLink } from "../actions/LocalizedLink"
import { ApplicationStatus } from "../notifications/ApplicationStatus"
import "./ImageCard.scss"
import { Listing } from "@bloom-housing/backend-core/types"
import { Tag } from "../text/Tag"
import { AppearanceStyleType } from "../global/AppearanceTypes"

export interface ImageCardProps {
  imageUrl: string
  subtitle?: string
  title: string
  href?: string
  listing?: Listing
  tagLabel?: string
}

const ImageCard = (props: ImageCardProps) => {
  let statusLabel
  let tag

  if (props.listing) {
    statusLabel = (
      <aside className="image-card__status">
        <ApplicationStatus listing={props.listing} vivid />
      </aside>
    )
    if (props.listing.isReservedBuilding) {
      tag = (
        <Tag styleType={AppearanceStyleType.warning} className="image-card__tag">
          {props.tagLabel}
        </Tag>
      )
    }
  }

  const image = (
    <div className="image-card__wrapper">
      {tag}
      <figure className="image-card">
        {props.imageUrl && <img src={props.imageUrl} alt={props.title} />}
        {!props.imageUrl && <div style={{ height: "300px", background: "#ccc" }}></div>}

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
