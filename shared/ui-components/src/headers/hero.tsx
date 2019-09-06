import * as React from "react"
import Button from "@bloom/ui-components/src/atoms/Button"

interface HeroProps {
  title: JSX.Element
  buttonTitle: string
  buttonLink: string
}

const heroClasses = ["bg-blue-700", "py-20", "px-5", "text-white", "text-center"]

const Hero = (props: HeroProps) => (
  <div className={heroClasses.join(" ")}>
    <h1 className="title mb-10">{props.title}</h1>
    <Button href={props.buttonLink}>{props.buttonTitle}</Button>
  </div>
)

export default Hero
