import * as React from "react"
import Icon from "../../atoms/Icon"

export interface ListingDetailHeaderProps {
  imageAlt: string
  imageSrc: string
  subtitle: string
  title: string
  children?: React.ReactNode
  hideHeader?: boolean
  desktopClass?: string
}

const ListingDetailHeader = (props: ListingDetailHeaderProps) => (
  <header className={props.hideHeader ? "detail-header md:hidden" : "detail-header"}>
    <img alt={props.imageAlt} className="detail-header__image " src={props.imageSrc} />
    <hgroup className="detail-header__hgroup">
      <h2 className="detail-header__title">{props.title}</h2>
      <span className="detail-header__subtitle">{props.subtitle}</span>
      <Icon symbol="arrow-down" size="medium" />
    </hgroup>
  </header>
)

export { ListingDetailHeader as default, ListingDetailHeader }
