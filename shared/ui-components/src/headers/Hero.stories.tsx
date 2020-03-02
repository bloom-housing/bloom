import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Hero from "./Hero"

export default {
  title: "Headers|Hero",
  parameters: {
    componentSubtitle: "Site-wide footer, shown on every page."
  },
  component: Hero,
  decorators: [withA11y]
}

const title = <>Welcome</>

export const hero = () => (
  <Hero title={title} buttonTitle="Rental Listings" buttonLink="/listings" listings={[]} />
)

export const withBackground = () => (
  <Hero
    title={title}
    buttonTitle="Rental Listings"
    buttonLink="/listings"
    listings={[]}
    backgroundImage="/images/banner.png"
  />
)
