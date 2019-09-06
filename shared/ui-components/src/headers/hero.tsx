import * as React from "react"
import LinkButton from "@bloom/ui-components/src/atoms/LinkButton"

interface HeroProps {
  title: JSX.Element
  buttonTitle: string
  buttonLink: string
}

const heroClasses = ["bg-blue-700", "py-20", "px-5", "text-white", "text-center"]

const Hero = (props: HeroProps) => (
  <div className={heroClasses.join(" ")}>
    <h1 className="title mb-10">{props.title}</h1>
    <LinkButton href={props.buttonLink}>{props.buttonTitle}</LinkButton>
  </div>
)

export default Hero
