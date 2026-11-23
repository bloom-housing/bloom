import React from "react"
import { fireEvent } from "@testing-library/react"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { MinimalListingCard } from "../../../src/components/home/MinimalListingCard"
import { mockNextRouter, render, screen } from "../../testUtils"

const listingWithImage = (fileId: string, description?: string): Listing => ({
  ...listing,
  listingImages: [
    {
      ordinal: 0,
      description,
      assets: {
        id: "asset-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        fileId,
        label: "building",
      },
    },
  ],
})

beforeAll(() => {
  mockNextRouter()
})

describe("<MinimalListingCard>", () => {
  it("renders image urls containing spaces and parentheses", () => {
    const imageUrl = "https://example-bucket.s3.amazonaws.com/listings/My Building (1).jpg"
    render(<MinimalListingCard listing={listingWithImage(imageUrl)} jurisdiction={jurisdiction} />)

    expect(screen.getByRole("img", { name: /picture of the building/i })).toHaveAttribute(
      "src",
      imageUrl
    )
  })

  it("uses the listing image description as alt text when present", () => {
    render(
      <MinimalListingCard
        listing={listingWithImage("/images/building.jpg", "Front of the building at dusk")}
        jurisdiction={jurisdiction}
      />
    )

    expect(screen.getByRole("img", { name: "Front of the building at dusk" })).toBeInTheDocument()
  })

  it("uses the placeholder image when the listing image url is empty", () => {
    render(<MinimalListingCard listing={listingWithImage("")} jurisdiction={jurisdiction} />)

    expect(screen.getByRole("img", { name: /picture of the building/i })).toHaveAttribute(
      "src",
      "/images/listing-fallback.png"
    )
  })

  it("falls back to the placeholder image when the listing image fails to load", () => {
    render(
      <MinimalListingCard
        listing={listingWithImage("/images/missing.jpg")}
        jurisdiction={jurisdiction}
      />
    )

    const image = screen.getByRole("img", { name: /picture of the building/i })
    fireEvent.error(image)

    expect(image).toHaveAttribute("src", "/images/listing-fallback.png")
  })
})
