import React from "react"
import { render, cleanup } from "@testing-library/react"
import { PreferencesList } from "../../src/lists/PreferencesList"

afterEach(cleanup)

const listingPreferences = [
  {
    ordinal: 1,
    links: [],
    title: "Title 1",
    subtitle: "Subtitle 1",
    description: "Description 1",
  },
  {
    ordinal: 2,
    links: [
      {
        url: "http://www.google.com",
        title: "Link Title 2",
      },
    ],
    title: "Title 2",
    subtitle: "Subtitle 2",
    description: "Description 2",
  },
  {
    ordinal: 3,
    links: [],
    title: "Title 3",
    subtitle: "Subtitle 3",
    description: "Description 3",
  },
]

describe("<PreferencesList>", () => {
  it("renders without error", () => {
    const { getByText } = render(<PreferencesList listingPreferences={listingPreferences} />)
    expect(getByText("Title 1")).toBeTruthy()
    expect(getByText("Subtitle 1")).toBeTruthy()
    expect(getByText("Description 1")).toBeTruthy()
    expect(getByText("Title 2")).toBeTruthy()
    expect(getByText("Subtitle 2")).toBeTruthy()
    expect(getByText("Description 2")).toBeTruthy()
    expect(getByText("Link Title 2")).toBeTruthy()
    expect(getByText("Title 3")).toBeTruthy()
    expect(getByText("Subtitle 3")).toBeTruthy()
    expect(getByText("Description 3")).toBeTruthy()
  })
})
