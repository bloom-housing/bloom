import * as React from "react"
import ImageCard from "../../cards/image_card"

interface ImageHeaderProps {
  as?: string
  className?: string
  href?: string
  imageUrl: string
  subImageContent?: any
  title: string
}

const ImageHeader = (props: ImageHeaderProps) => (
  <header className={props.className}>
    <ImageCard title={props.title} imageUrl={props.imageUrl} href={props.href} as={props.as} />
    <div>{props.subImageContent}</div>
  </header>
)

export default ImageHeader
