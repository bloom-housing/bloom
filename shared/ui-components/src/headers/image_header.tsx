import * as React from 'react'
import ImageCard from '../cards/image_card'

const SubImageContent = (props: any) => (<div>{props.content}</div>)

const ImageHeader = (props: any) => (
  <header className={props.className}>
    <ImageCard
      title={props.title}
      imageUrl={props.imageUrl}
      href={props.href}
      as={props.as} />
    <SubImageContent content={props.subImageContent} />
  </header>
)

export default ImageHeader
