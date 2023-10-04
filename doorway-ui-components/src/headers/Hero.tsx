import * as React from "react"
import { t } from "@bloom-housing/ui-components"
import "./Hero.scss"
import { LinkButton } from "../actions/LinkButton"

export interface HeroProps {
  allApplicationsClosed?: boolean
  backgroundImage?: string
  buttonLink?: string
  buttonTitle?: string
  centered?: boolean
  children?: React.ReactNode
  className?: string
  extraLargeTitle?: boolean
  customActions?: React.ReactNode
  innerClassName?: string
  secondaryButtonLink?: string
  secondaryButtonTitle?: string
  title: React.ReactNode
  titleClassName?: string
  strings?: {
    allApplicationsClosed?: string
  }
}

const HeroButton = (props: { title: string; href: string; className?: string }) => (
  <span className={`${props.className || ""} hero__button"`}>
    <LinkButton href={props.href}>{props.title}</LinkButton>
  </span>
)

const Hero = (props: HeroProps) => {
  let subHeader, styles
  const heroClasses = ["hero"]
  if (props.centered) heroClasses.push("centered")
  if (props.className) heroClasses.push(props.className)

  const innerClasses = ["hero__inner"]
  if (props.innerClassName) innerClasses.push(props.innerClassName)

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

  return (
    <div className={heroClasses.join(" ")} style={styles} data-testid="hero-component">
      <div className={innerClasses.join(" ")}>
        <h1
          className={`hero__title 
            ${props.extraLargeTitle ? "lg:text-6.5xl" : ""} 
            ${props.titleClassName || ""}
            `}
        >
          {props.title}
        </h1>
        {subHeader}

        {props.customActions ? (
          props.customActions
        ) : (
          <>
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
                  <HeroButton
                    className={`px-5`}
                    href={props.buttonLink}
                    title={props.buttonTitle}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export { Hero as default, Hero }
