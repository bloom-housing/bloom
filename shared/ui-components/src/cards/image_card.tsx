import * as React from "react"
import LocalizedLink from "../atoms/LocalizedLink"

const Flag = (props: any) => <div>{props.text}</div>

interface ImageCardProps {
  flag?: string
  imageUrl: string
  subtitle?: string
  title: string
  href?: string
  as?: string
}

const ImageCard = (props: ImageCardProps) => {
  const image = (
    <figure className="relative">
      {props.imageUrl && <img src={props.imageUrl} alt={props.title} />}
      {!props.imageUrl && <div style={{ height: "300px", background: "#ccc" }}></div>}
      {props.flag && <Flag text={props.flag} />}
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
