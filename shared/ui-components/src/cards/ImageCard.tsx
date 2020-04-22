import * as React from "react"
import LocalizedLink from "../atoms/LocalizedLink"
import ApplicationStatus from "@bloom-housing/ui-components/src/atoms/ApplicationStatus"
import "./ImageCard.scss"
import { Listing } from "@bloom-housing/core"

export interface ImageCardProps {
  imageUrl: string
  subtitle?: string
  title: string
  href?: string
  as?: string
  listing?: Listing
}

const ImageCard = (props: ImageCardProps) => {
  let statusLabel

  if (props.listing) {
    statusLabel = (
      <aside className="image-card__status">
        <ApplicationStatus listing={props.listing} vivid />
      </aside>
    )
  }

  const image = (
    <div className="image-card__wrapper">
      <figure className="image-card">
        {props.imageUrl && <img src={props.imageUrl} alt={props.title} />}
        {!props.imageUrl && <div style={{ height: "300px", background: "#ccc" }}></div>}
        <figcaption className="image-card__figcaption">
          <h2 className="image-card__title">{props.title}</h2>
          <p>{props.subtitle}</p>
        </figcaption>
      </figure>
      {statusLabel}
    </div>
  )

  let card = image

  if (props.href && props.as) {
    card = (
      <LocalizedLink href={props.href} as={props.as}>
        {image}
      </LocalizedLink>
    )
  }

  return card
}

export { ImageCard as default, ImageCard }
