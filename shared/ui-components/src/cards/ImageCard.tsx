import * as React from "react"
import LocalizedLink from "../atoms/LocalizedLink"
import ApplicationStatus from "@bloom-housing/ui-components/src/atoms/ApplicationStatus"
import "./ImageCard.scss"
import { Listing } from "@bloom-housing/core/src/listings"

const Flag = (props: any) => <div>{props.text}</div>

interface ImageCardProps {
  flag?: string
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
      <figcaption className="absolute inset-x-0 top-0 mt-2">
        <span className="inline-block">
          <ApplicationStatus listing={props.listing} vivid />
        </span>
      </figcaption>
    )
  }

  const image = (
    <figure className="relative">
      {props.imageUrl && <img src={props.imageUrl} alt={props.title} />}
      {!props.imageUrl && <div style={{ height: "300px", background: "#ccc" }}></div>}
      {props.flag && <Flag text={props.flag} />}
      {statusLabel}
      <figcaption className="image-card__figcaption">
        <h2 className="image-card__title">{props.title}</h2>
        <p>{props.subtitle}</p>
      </figcaption>
    </figure>
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

export default ImageCard
