import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ImageCard } from "../../src/blocks/ImageCard"
import { Listing } from "@bloom-housing/backend-core/types"
import { ArcherListing } from "@bloom-housing/backend-core/types/src/archer-listing"

const listing = Object.assign({}, ArcherListing) as Listing
afterEach(cleanup)

describe("<ImageCard>", () => {
  it("renders title, subtitle, and image", () => {
    const { getByText, getByAltText } = render(
      <ImageCard imageUrl={"/images/listing.jpg"} title={"My Building"} subtitle={"The Address"} />
    )
    expect(getByText("My Building")).not.toBeNull()
    expect(getByText("The Address")).not.toBeNull()
    expect(getByAltText("My Building")).not.toBeNull()
  })
  it("renders with a link", () => {
    const { getByAltText } = render(
      <ImageCard
        imageUrl={"/images/listing.jpg"}
        title={"My Building"}
        subtitle={"The Address"}
        href="/listings"
      />
    )
    expect(getByAltText("My Building").closest("a")?.getAttribute("href")).toBe("/listings")
  })
  it("renders with an application status bar", () => {
    const { getByText } = render(
      <ImageCard
        imageUrl={"/images/listing.jpg"}
        title={"My Building"}
        subtitle={"The Address"}
        listing={listing}
      />
    )
    expect(getByText("Applications Closed", { exact: false })).not.toBeNull()
  })
})
