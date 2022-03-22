import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ListingCard } from "../../src/page_components/listing/ListingCard"

afterEach(cleanup)

describe("<ListingCard>", () => {
  it("renders full props without error", () => {
    const { getByText, getAllByText } = render(
      <ListingCard
        imageCardProps={{
          imageUrl: "imageURL",
          href: "listing-link",
          tags: [{ text: "reserved community tag" }],
          statuses: [{ content: "status content" }],
        }}
        tableProps={{
          headers: {
            unitType: "t.unitType",
            minimumIncome: "t.incomeRange",
            rent: "t.rent",
          },
          data: [{ unitType: "cellA", minimumIncome: "cellB", rent: "cellC" }],
          responsiveCollapse: true,
          cellClassName: "px-5 py-3",
        }}
        cardTags={[{ text: "card tag 1" }, { text: "card tag 2" }]}
        footerButtons={[{ text: "see details", href: `see-details-link` }]}
        contentProps={{
          contentHeader: { text: "title" },
          contentSubheader: { text: "subtitle" },
          tableHeader: { text: "optional table header" },
          tableSubheader: { text: "optional table subheader" },
        }}
      >
        <div>child content</div>
      </ListingCard>
    )
    expect(getByText("subtitle")).toBeTruthy()
    expect(getByText("title")).toBeTruthy()
    expect(getByText("see details")).toBeTruthy()
    expect(getByText("card tag 1")).toBeTruthy()
    expect(getByText("card tag 2")).toBeTruthy()
    expect(getByText("child content")).toBeTruthy()
    expect(getAllByText("reserved community tag")).toBeTruthy()
    expect(getAllByText("status content")).toBeTruthy()
    expect(getAllByText("Unit Type")).toBeTruthy()
    expect(getAllByText("Income Range")).toBeTruthy()
    expect(getAllByText("Rent")).toBeTruthy()
    expect(getAllByText("cellA")).toBeTruthy()
    expect(getAllByText("cellB")).toBeTruthy()
    expect(getAllByText("cellC")).toBeTruthy()
    expect(getAllByText("optional table header")).toBeTruthy()
    expect(getAllByText("optional table subheader")).toBeTruthy()
  })
  it("renders minimal props without error", () => {
    const { getByText } = render(
      <ListingCard
        imageCardProps={{
          imageUrl: "imageURL",

          href: "listing-link",
        }}
        contentProps={{
          contentHeader: { text: "title" },
          contentSubheader: { text: "subtitle" },
        }}
      />
    )
    expect(getByText("title")).toBeTruthy()
    expect(getByText("subtitle")).toBeTruthy()
  })
})
