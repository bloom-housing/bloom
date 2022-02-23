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
          subtitle: "subtitle",
          title: "title",
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
        seeDetailsLink={`see-details-link`}
        tableHeaderProps={{
          tableHeader: "optional table header",
          tableSubHeader: "optional table subheader",
        }}
      >
        <div>Child content</div>
      </ListingCard>
    )
    expect(getByText("subtitle")).toBeTruthy()
    expect(getByText("title")).toBeTruthy()
    expect(getByText("Child content")).toBeTruthy()
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
          subtitle: "subtitle",
          title: "title",
          href: "listing-link",
        }}
      />
    )
    expect(getByText("subtitle")).toBeTruthy()
    expect(getByText("title")).toBeTruthy()
  })
})
