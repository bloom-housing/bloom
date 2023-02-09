import * as React from "react"
import { Icon } from "../../icons/Icon"

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
  <header
    className={
      props.hideHeader
        ? "detail-header md:hidden flex justify-start"
        : "detail-header flex justify-start"
    }
  >
    <span className="w-14 me-2 -ms-2.5 md:absolute md:left-0 md:me-0">
      <img alt={props.imageAlt} className="detail-header__image " src={props.imageSrc} />
    </span>
    <div className="flex justify-between w-full">
      <hgroup className="detail-header__hgroup">
        <h2 className="detail-header__title">{props.title}</h2>
        <span className="detail-header__subtitle">{props.subtitle}</span>
      </hgroup>
      <span className="md:hidden">
        <Icon symbol="arrowDown" size="small" />
      </span>
    </div>
  </header>
)

export { ListingDetailHeader as default, ListingDetailHeader }
