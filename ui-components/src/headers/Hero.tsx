import * as React from "react"
import { LinkButton } from "../actions/LinkButton"
import { Listing } from "@bloom-housing/backend-core/types"
import moment from "moment"
import { t } from "../helpers/translator"
import { openDateState } from "../helpers/state"
import "./Hero.scss"

export interface HeroProps {
  title: React.ReactNode
  backgroundImage?: string
  buttonTitle: string
  buttonLink: string
  listings?: Listing[]
  children?: React.ReactNode
  isCentered?: boolean
}

const listingOpen = (listing: Listing) => {
  return moment() < moment(listing.applicationDueDate)
}

const Hero = (props: HeroProps) => {
  let subHeader, styles
  let classNames = ""
  if (props.listings) {
    if (!props.listings.some(listingOpen) && !props.listings.some(openDateState)) {
      subHeader = <h2 className="hero__subtitle">{t("welcome.allApplicationClosed")}</h2>
    }
  } else if (props.children) {
    subHeader = <h2 className="hero__subtitle">{props.children}</h2>
  }
  if (props.backgroundImage) {
    styles = { backgroundImage: `url(${props.backgroundImage})` }
  }
  if (props.isCentered) {
    classNames = "is-cetered"
  }
  return (
    <div className={`hero ${classNames}`} style={styles}>
      <h1 className="hero__title">{props.title}</h1>
      {subHeader}
      <LinkButton href={props.buttonLink}>{props.buttonTitle}</LinkButton>
    </div>
  )
}

export { Hero as default, Hero }
