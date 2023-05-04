import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Hero } from "../../src/headers/Hero"

afterEach(cleanup)

describe("<Hero>", () => {
  it("renders with no listings", () => {
    const { getByText } = render(
      <Hero title={<>Say Hello to Your Hero</>} buttonTitle="I am a Button" buttonLink="/listings">
        Subheader
      </Hero>
    )
    expect(getByText("Say Hello to Your Hero")).toBeTruthy()
    expect(getByText("Subheader")).toBeTruthy()
    expect(getByText("I am a Button")).toBeTruthy()
  })
  it("renders with closed listings", () => {
    const { getByText } = render(
      <Hero
        title={<>Say Hello to Your Hero</>}
        buttonTitle="I am a Button"
        buttonLink="/listings"
        allApplicationsClosed={true}
      />
    )
    expect(getByText("Say Hello to Your Hero")).toBeTruthy()
    expect(
      getByText("All applications are currently closed, but you can view closed listings.")
    ).toBeTruthy()
    expect(getByText("I am a Button")).toBeTruthy()
  })
  it("renders with some listings open", () => {
    const { getByText } = render(
      <Hero
        title={<>Say Hello to Your Hero</>}
        buttonTitle="I am a Button"
        buttonLink="/listings"
        backgroundImage={"url"}
      />
    )
    expect(getByText("Say Hello to Your Hero")).toBeTruthy()
    expect(getByText("I am a Button")).toBeTruthy()
  })

  it("renders with multiple buttons if provided", () => {
    const { getByText } = render(
      <Hero
        title={<>Say Hello to Your Hero</>}
        buttonTitle="I am a Button"
        buttonLink="/listings/for-rent"
        secondaryButtonTitle="I am another Button"
        secondaryButtonLink="/listings/for-sale"
        backgroundImage={"url"}
      />
    )
    expect(getByText("Say Hello to Your Hero")).toBeTruthy()
    expect(getByText("I am a Button")).toBeTruthy()
    expect(getByText("I am another Button")).toBeTruthy()
  })
})
