import React from "react"
import { render, cleanup, getAllByText } from "@testing-library/react"
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
          data: [
            {
              unitType: { content: "cellA" },
              minimumIncome: { content: "cellB" },
              rent: { content: "cellC" },
            },
          ],
          responsiveCollapse: true,
          cellClassName: "px-5 py-3",
        }}
        cardTags={[{ text: "card tag 1" }, { text: "card tag 2" }]}
        footerButtons={[{ text: "see details", href: `see-details-link` }]}
        contentProps={{
          contentHeader: { content: "title" },
          contentSubheader: { content: "subtitle" },
          tableHeader: { content: "optional table header" },
          tableSubheader: { content: "optional table subheader" },
        }}
      >
        <div>child content</div>
      </ListingCard>
    )
    expect(getAllByText("subtitle")).toBeTruthy()
    expect(getAllByText("title")).toBeTruthy()
    expect(getByText("see details")).toBeTruthy()
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
    const { getAllByText } = render(
      <ListingCard
        imageCardProps={{
          imageUrl: "imageURL",

          href: "listing-link",
        }}
        contentProps={{
          contentHeader: { content: "title" },
          contentSubheader: { content: "subtitle" },
        }}
      />
    )
    expect(getAllByText("title")).toBeTruthy()
    expect(getAllByText("subtitle")).toBeTruthy()
  })
})
