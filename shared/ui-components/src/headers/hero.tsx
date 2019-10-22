import * as React from "react"
import LinkButton from "@bloom/ui-components/src/atoms/LinkButton"
import { Listing } from "@bloom/ui-components/src/types"
import * as moment from "moment"
import t from "@bloom/ui-components/src/helpers/translator"

interface HeroProps {
  title: JSX.Element
  buttonTitle: string
  buttonLink: string
  listings: Listing[]
}

const heroClasses = ["hero"]

const listingOpen = listing => {
  return moment() < moment(listing.application_due_date)
}

const Hero = (props: HeroProps) => {
  let subHeader
  if (!props.listings.some(listingOpen)) {
    subHeader = (
      <h2 className="t-alt-sans text-gray-100 text-base mb-4">
        {t("welcome.all_application_closed")}
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
