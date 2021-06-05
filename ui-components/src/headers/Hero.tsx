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
  secondaryButtonTitle?: string
  secondaryButtonLink?: string
  listings?: Listing[]
  children?: React.ReactNode
  centered?: boolean
}

const listingOpen = (listing: Listing) => {
  return moment() < moment(listing.applicationDueDate)
}

const HeroButton = (props: { title: string; href: string; className?: string }) => (
  <span className={props.className + " hero__button"}>
    <LinkButton href={props.href}>{props.title}</LinkButton>
  </span>
)

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
  if (props.centered) {
    classNames = "centered"
  }
  const hasSecondary = props.secondaryButtonTitle && props.secondaryButtonLink
  return (
    <div className={`hero ${classNames}`} style={styles}>
      <h1 className="hero__title">{props.title}</h1>
      {subHeader}
      <div className="grid md:grid-cols-6 gap-5 ">
        <HeroButton
          className={`md:col-start-3 ${hasSecondary ?? "col-span-2"}`}
          href={props.buttonLink}
          title={props.buttonTitle}
        />
        {hasSecondary && (
          <HeroButton href={props.secondaryButtonLink} title={props.secondaryButtonTitle} />
        )}
      </div>
    </div>
  )
}

export { Hero as default, Hero }
