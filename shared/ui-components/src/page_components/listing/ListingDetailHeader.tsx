import * as React from "react"

export interface ListingDetailHeaderProps {
  imageAlt: string
  imageSrc: string
  subtitle: string
  title: string
  children?: React.ReactNode
}

const ListingDetailHeader = (props: ListingDetailHeaderProps) => (
  <header className="deatil-header">
    <img alt={props.imageAlt} className="deatil-header__image " src={props.imageSrc} />
    <h2 className="deatil-header__title">{props.title}</h2>
    <span className="deatil-header__subtitle">{props.subtitle}</span>
  </header>
)

export default ListingDetailHeader
