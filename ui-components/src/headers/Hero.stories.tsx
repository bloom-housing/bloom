import * as React from "react"

import { Hero } from "./Hero"
import Archer from "../../__tests__/fixtures/archer.json"
import Triton from "../../__tests__/fixtures/triton-test.json"
import { Listing } from "@bloom-housing/backend-core/types"

export default {
  title: "Headers/Hero",
}

const archer = Object.assign({}, Archer) as any
const triton = Object.assign({}, Triton) as any
const listings = [archer, triton] as Listing[]

export const withListings = () => (
  <Hero
    title={<>Say Hello to Your Hero</>}
    buttonTitle="I am a Button"
    buttonLink="/listings"
    listings={listings}
  />
)

export const withNoListings = () => (
  <Hero
    title={<>Say Hello to Your Hero</>}
    buttonTitle="I am a Button"
    buttonLink="/listings"
    listings={[]}
  />
)

export const withBackground = () => (
  <Hero
    title={<>Say Hello to Your Hero</>}
    buttonTitle="Rental Listings"
    buttonLink="/listings"
    listings={[]}
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
