import * as React from "react"
import LinkButton from "../../atoms/LinkButton"
import { Listing } from "@bloom-housing/core"
import moment from "moment"
import t from "../../helpers/translator"
import { openDateState } from "../../helpers/state"
import "./Hero.scss"

export interface HeroProps {
  title: JSX.Element
  backgroundImage?: string
  buttonTitle: string
  buttonLink: string
  listings?: Listing[]
  children?: JSX.Element
}

const listingOpen = (listing: Listing) => {
  return moment() < moment(listing.applicationDueDate)
}

const Hero = (props: HeroProps) => {
  let subHeader, styles
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
  return (
    <div className="hero" style={styles}>
      <h1 className="hero__title">{props.title}</h1>
      {subHeader}
      <LinkButton href={props.buttonLink}>{props.buttonTitle}</LinkButton>
    </div>
  )
}

export { Hero as default, Hero }
