import * as React from "react"
import LinkButton from "@bloom-housing/ui-components/src/atoms/LinkButton"
import { Listing } from "@bloom-housing/core/src/listings"
import moment from "moment"
import t from "@bloom-housing/ui-components/src/helpers/translator"
import "./Hero.scss"

export interface HeroProps {
  title: JSX.Element
  backgroundImage?: string
  buttonTitle: string
  buttonLink: string
  listings: Listing[]
}

const heroClasses = ["hero"]

const listingOpen = (listing: Listing) => {
  return moment() < moment(listing.applicationDueDate)
}

const Hero = (props: HeroProps) => {
  let subHeader, styles
  if (!props.listings.some(listingOpen)) {
    subHeader = (
      <h2 className="t-alt-sans text-gray-100 text-base mb-4">
        {t("welcome.allApplicationClosed")}
      </h2>
    )
  }
  if (props.backgroundImage) {
    styles = { backgroundImage: `url(${props.backgroundImage})` }
  }
  return (
    <div className={heroClasses.join(" ")} style={styles}>
      <h1 className="hero__title mb-4">{props.title}</h1>
      {subHeader}
      <LinkButton href={props.buttonLink}>{props.buttonTitle}</LinkButton>
    </div>
  )
}

export default Hero
