import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ListingDetailHeader } from "../../src/page_components/listing/ListingDetailHeader"

afterEach(cleanup)

describe("<ListingDetailHeader>", () => {
  it("renders without error", () => {
    const { getByText } = render(
      <ListingDetailHeader imageAlt={""} imageSrc={""} subtitle={"Subtitle"} title={"Title"} />
    )
    expect(getByText("Title")).toBeTruthy()
    expect(getByText("Subtitle")).toBeTruthy()
  })
})
