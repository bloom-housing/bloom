import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ImageCard } from "../../src/blocks/ImageCard"
import { t } from "../../src/helpers/translator"
import { ApplicationStatusType } from "../../src/global/ApplicationStatusType"

afterEach(cleanup)

describe("<ImageCard>", () => {
  it("renders title, subtitle, image and alt text", () => {
    const { getByAltText } = render(
      <ImageCard imageUrl={"/images/listing.jpg"} description={"A description of the image"} />
    )

    expect(getByAltText("A description of the image")).not.toBeNull()
  })
  it("renders with a link", () => {
    const { getByAltText } = render(
      <ImageCard
        imageUrl={"/images/listing.jpg"}
        href="/listings"
        description={"A description of the image"}
      />
    )
    expect(getByAltText("A description of the image").closest("a")?.getAttribute("href")).toBe(
      "/listings"
    )
  })
  it("renders with an application status bar", () => {
    const { getByText } = render(
      <ImageCard
        imageUrl={"/images/listing.jpg"}
        statuses={[
          { status: ApplicationStatusType.Closed, content: t("listings.applicationsClosed") },
        ]}
      />
    )
    expect(getByText("Applications Closed", { exact: false })).not.toBeNull()
  })
  it("renders with multiple applications status bars", () => {
    const { getByText } = render(
      <ImageCard
        imageUrl={"/images/listing.jpg"}
        statuses={[
          { status: ApplicationStatusType.Closed, content: "Applications Closed" },
          { status: ApplicationStatusType.PreLottery, content: "Lottery Results Posted Tomorrow" },
        ]}
      />
    )
    expect(getByText("Applications Closed", { exact: false })).not.toBeNull()
    expect(getByText("Lottery Results Posted Tomorrow", { exact: false })).not.toBeNull()
  })
  it("renders with custom icon", () => {
    const { getByText } = render(
      <ImageCard
        imageUrl={"/images/listing.jpg"}
        statuses={[
          { status: ApplicationStatusType.Matched, content: "Matched", iconType: "check" },
        ]}
      />
    )
    expect(getByText("Matched", { exact: false })).not.toBeNull()
  })

  it("renders with image tags", () => {
    const { getByText } = render(
      <ImageCard
        imageUrl={"/images/listing.jpg"}
        tags={[
          { text: "This is a long label", iconType: "mail" },
          { text: "This is another longer label" },
        ]}
      />
    )
    expect(getByText("This is a long label")).not.toBeNull()
    expect(getByText("This is another longer label")).not.toBeNull()
  })
})
