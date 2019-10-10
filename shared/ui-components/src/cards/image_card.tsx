import * as React from "react"
import LocalizedLink from "../atoms/LocalizedLink"
import ApplicationDeadline from "@bloom/ui-components/src/page_components/listing/listing_sidebar/ApplicationDeadline"

const Flag = (props: any) => <div>{props.text}</div>

interface ImageCardProps {
  flag?: string
  imageUrl: string
  subtitle?: string
  title: string
  href?: string
  as?: string
  date?: string
}

const ImageCard = (props: ImageCardProps) => {
  let statusLabel

  if (props.date) {
    statusLabel = (
      <figcaption className="absolute inset-x-0 top-0 mt-2">
        <span className="inline-block">
          <ApplicationDeadline date={props.date} vivid />
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
      <figcaption className="absolute inset-x-0 bottom-0">
        <h2 className="text-white text-center text-2xl uppercase font-alt-sans mb-3">{props.title}</h2>
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
