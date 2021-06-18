import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Hero } from "../../src/headers/Hero"
import Archer from "../../__tests__/fixtures/archer.json"
import { Listing } from "@bloom-housing/backend-core/types"
import dayjs from "dayjs"

afterEach(cleanup)

const archer = Object.assign({}, Archer) as any

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
    const pastArcher = archer
    pastArcher.applicationDueDate = dayjs().subtract(10, "days").format()
    pastArcher.applicationOpenDate = dayjs().subtract(15, "days").format()
    const { getByText } = render(
      <Hero
        title={<>Say Hello to Your Hero</>}
        buttonTitle="I am a Button"
        buttonLink="/listings"
        listings={[pastArcher] as Listing[]}
      />
    )
    expect(getByText("Say Hello to Your Hero")).toBeTruthy()
    expect(
      getByText("All applications are currently closed, but you can view closed listings.")
    ).toBeTruthy()
    expect(getByText("I am a Button")).toBeTruthy()
  })
  it("renders with some listings open", () => {
    const futureArcher = archer
    futureArcher.applicationDueDate = dayjs().add(15, "days").format()
    futureArcher.applicationOpenDate = dayjs().subtract(10, "days").format()
    const { getByText } = render(
      <Hero
        title={<>Say Hello to Your Hero</>}
        buttonTitle="I am a Button"
        buttonLink="/listings"
        backgroundImage={"url"}
        listings={[futureArcher] as Listing[]}
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
