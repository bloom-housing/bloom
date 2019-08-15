import * as React from "react"
import Link from "next/link"

interface HeroProps {
  title: JSX.Element
  buttonTitle: string
  buttonLink: string
}

const heroClasses = ["bg-blue-700", "py-20", "px-5", "text-white", "text-center"]

const buttonClasses = [
  "bg-white",
  "text-primary",
  "uppercase",
  "text-lg",
  "t-alt-sans",
  "px-8",
  "py-4"
]

const Hero = (props: HeroProps) => (
  <div className={heroClasses.join(" ")}>
    <h1 className="title mb-10">{props.title}</h1>
    <Link href={props.buttonLink}>
      <a className={buttonClasses.join(" ")}>{props.buttonTitle}</a>
    </Link>
  </div>
)

export default Hero
