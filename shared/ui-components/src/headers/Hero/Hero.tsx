import * as React from "react"
import LinkButton from "../../atoms/LinkButton"
import { Listing } from "@bloom-housing/core/src/listings"
import moment from "moment"
import t from "../../helpers/translator"
import { openDateState } from "../../helpers/state"
import "./Hero.scss"

export interface HeroProps {
  title: JSX.Element
  backgroundImage?: string
  buttonTitle: string
  buttonLink: string
  listings: Listing[]
}

const listingOpen = (listing: Listing) => {
  return moment() < moment(listing.applicationDueDate)
}

const Hero = (props: HeroProps) => {
  let subHeader, styles
  if (!props.listings.some(listingOpen) && !props.listings.some(openDateState)) {
    subHeader = <h2 className="hero__subtitle">{t("welcome.allApplicationClosed")}</h2>
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

export default Hero
