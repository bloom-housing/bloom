import React from "react"
import { render, cleanup } from "@testing-library/react"
import { PreferencesList } from "../../src/lists/PreferencesList"
import Gish from "../../__tests__/fixtures/gish.json"

afterEach(cleanup)

const listing = Object.assign({}, Gish) as any

describe("<PreferencesList>", () => {
  it("renders without error", () => {
    const { getByText } = render(<PreferencesList preferences={listing.preferences} />)
    expect(getByText(listing.preferences[0].title)).toBeTruthy()
    expect(getByText(listing.preferences[0].subtitle)).toBeTruthy()
    expect(getByText(listing.preferences[0].description)).toBeTruthy()
    expect(getByText(listing.preferences[1].title)).toBeTruthy()
    expect(getByText(listing.preferences[1].subtitle)).toBeTruthy()
    expect(getByText(listing.preferences[1].description)).toBeTruthy()
    expect(getByText(listing.preferences[1].links[1].title)).toBeTruthy()
    expect(getByText(listing.preferences[2].title)).toBeTruthy()
  })
})
