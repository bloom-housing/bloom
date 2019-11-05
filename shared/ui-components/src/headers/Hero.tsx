import * as React from "react"
import LinkButton from "@bloom-housing/ui-components/src/atoms/LinkButton"
import { Listing } from "@bloom-housing/core/src/listings"
import * as moment from "moment"
import t from "@bloom-housing/ui-components/src/helpers/translator"
import "./Hero.scss"

interface HeroProps {
  title: JSX.Element
  buttonTitle: string
  buttonLink: string
  listings: Listing[]
}

const heroClasses = ["hero"]

const listingOpen = listing => {
  return moment() < moment(listing.applicationDueDate)
}

const Hero = (props: HeroProps) => {
  let subHeader
  if (!props.listings.some(listingOpen)) {
    subHeader = (
      <h2 className="t-alt-sans text-gray-100 text-base mb-4">
        {t("welcome.allApplicationClosed")}
      </h2>
    )
  }
  return (
    <div className={heroClasses.join(" ")}>
      <h1 className="hero__title mb-4">{props.title}</h1>
      {subHeader}
      <LinkButton href={props.buttonLink}>{props.buttonTitle}</LinkButton>
    </div>
  )
}

export default Hero
