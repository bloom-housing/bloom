import * as React from "react"
import { LinkButton } from "../actions/LinkButton"
import { t } from "../helpers/translator"
import "./Hero.scss"

export interface HeroProps {
  allApplicationsClosed?: boolean
  backgroundImage?: string
  buttonLink?: string
  buttonTitle?: string
  centered?: boolean
  children?: React.ReactNode
  extraLargeTitle?: boolean
  secondaryButtonLink?: string
  secondaryButtonTitle?: string
  title: React.ReactNode
  strings?: {
    allApplicationsClosed?: string
  }
}

const HeroButton = (props: { title: string; href: string; className?: string }) => (
  <span className={props.className + " hero__button"}>
    <LinkButton href={props.href}>{props.title}</LinkButton>
  </span>
)

const Hero = (props: HeroProps) => {
  let subHeader, styles
  let classNames = ""
  if (props.allApplicationsClosed) {
    subHeader = (
      <h2 className="hero__subtitle">
        {props.strings?.allApplicationsClosed ?? t("welcome.allApplicationClosed")}
      </h2>
    )
  } else if (props.children) {
    subHeader = <h2 className="hero__subtitle">{props.children}</h2>
  }
  if (props.backgroundImage) {
    styles = { backgroundImage: `url(${props.backgroundImage})` }
  }
  if (props.centered) {
    classNames = "centered"
  }
  return (
    <div className={`hero ${classNames}`} style={styles} data-test-id={"hero-component"}>
      <h1 className={`hero__title ${props.extraLargeTitle ? "lg:text-6.5xl" : ""}`}>
        {props.title}
      </h1>
      {subHeader}

      {props.buttonTitle && props.buttonLink && (
        <>
          {props.secondaryButtonTitle && props.secondaryButtonLink ? (
            <div className="hero__buttons">
              <HeroButton
                className={"md:col-start-2 with_secondary"}
                href={props.buttonLink}
                title={props.buttonTitle}
              />
              <HeroButton
                className={"with_secondary"}
                href={props.secondaryButtonLink}
                title={props.secondaryButtonTitle}
              />
            </div>
          ) : (
            <HeroButton className={"px-5"} href={props.buttonLink} title={props.buttonTitle} />
          )}
        </>
      )}
    </div>
  )
}

export { Hero as default, Hero }
