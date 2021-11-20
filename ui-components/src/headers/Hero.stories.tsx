import * as React from "react"

import { Hero } from "./Hero"

export default {
  title: "Headers/Hero",
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
    buttonTitle="I am small"
    extraLargeTitle={true}
    secondaryButtonLink="/listings/for-sale"
    secondaryButtonTitle="I am a long button"
    title={"Say Hello to Your Hero I am Long"}
  />
)
