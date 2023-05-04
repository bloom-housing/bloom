import * as React from "react"
import { BADGES } from "../../.storybook/constants"
import { Hero } from "./Hero"

export default {
  title: "Headers/Hero 🚩",
  parameters: {
    badges: [BADGES.GEN2],
  },
}

export const withListings = () => (
  <Hero title={<>Say Hello to Your Hero</>} buttonTitle="I am a Button" buttonLink="/listings" />
)

export const withNoListings = () => (
  <Hero
    title={<>Say Hello to Your Hero</>}
    buttonTitle="I am a Button"
    buttonLink="/listings"
    allApplicationsClosed={true}
  />
)

export const withBackground = () => (
  <Hero
    title={<>Say Hello to Your Hero</>}
    buttonTitle="Rental Listings"
    buttonLink="/listings"
    backgroundImage="/images/banner.png"
  />
)

export const withSecondaryButton = () => (
  <Hero
    title={<>Say Hello to Your Hero</>}
    buttonTitle="Rent"
    buttonLink="/listings"
    secondaryButtonTitle="Buy"
    secondaryButtonLink="/listings/for-sale"
    backgroundImage="/images/banner.png"
  />
)

export const withExtraLargeTitleAndSecondaryButton = () => (
  <Hero
    backgroundImage="/images/banner.png"
    buttonLink="/listings"
    buttonTitle="Rent"
    extraLargeTitle={true}
    secondaryButtonLink="/listings/for-sale"
    secondaryButtonTitle="Buy"
    title={"Say Hello to Your Hero"}
  />
)

export const withCustomActions = () => (
  <Hero
    title={<>Say Hello to Your Hero</>}
    buttonTitle="Rental Listings"
    buttonLink="/listings"
    backgroundImage="/images/banner.png"
    customActions={<>Hero custom action content</>}
  />
)
