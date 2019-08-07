import * as React from 'react'
import Link from 'next/link'

const Flag = (props: any) => (<div>{props.text}</div>)

interface ImageCardProps {
  flag?: string,
  imageUrl: string,
  subtitle?: string,
  title: string,
  href?: string,
  as?: string
}

const ImageCard = (props: ImageCardProps) => (
  <Link href={props.href} as={props.as}>
    <a>
      <figure className="relative">
        {props.imageUrl && <img src={props.imageUrl} alt={props.title} />}
        {!props.imageUrl && <div style={{height: "300px", background: "#ccc"}}></div>}
        {props.flag && <Flag text={props.flag} />}
        <figcaption className="absolute inset-x-0 bottom-0">
          <h2 className="text-white text-center text-2xl uppercase t-alt-sans mb-3">{props.title}</h2>
          <p>{props.subtitle}</p>
        </figcaption>
      </figure>
    </a>
  </Link>
)

export default ImageCard
