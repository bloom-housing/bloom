import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ListingCard } from "../../src/page_components/listing/ListingCard"

afterEach(cleanup)

describe("<ListingCard>", () => {
  it("renders without error", () => {
    const { getByText, getAllByText } = render(
      <ListingCard
        imageCardProps={{
          imageUrl: "imageURL",
          subtitle: "subtitle",
          title: "title",
          href: "listing-link",
          tagLabel: "reserved community tag",
          statuses: [{ content: "status content" }],
        }}
        tableProps={{
          headers: {
            unitType: "unit type",
            minimumIncome: "minimum income",
            rent: "rent",
          },
          data: [{ data: [{ unitType: "cellA", minimumIncome: "cellB", rent: "cellC" }] }],
          responsiveCollapse: true,
          cellClassName: "px-5 py-3",
        }}
        seeDetailsLink={`see-details-link`}
        tableHeader={"optional table header"}
      />
    )
    expect(getByText("subtitle")).toBeTruthy()
    expect(getByText("title")).toBeTruthy()
    expect(getAllByText("reserved community tag")).toBeTruthy()
    expect(getAllByText("status content")).toBeTruthy()
    expect(getAllByText("unit type")).toBeTruthy()
    expect(getAllByText("minimum income")).toBeTruthy()
    expect(getAllByText("rent")).toBeTruthy()
    expect(getAllByText("cellA")).toBeTruthy()
    expect(getAllByText("cellB")).toBeTruthy()
    expect(getAllByText("cellC")).toBeTruthy()
    expect(getAllByText("optional table header")).toBeTruthy()
  })
})
