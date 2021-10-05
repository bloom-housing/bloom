import * as React from "react"
import { ListingCard } from "./ListingCard"

export default {
  title: "Listing/ListingCard",
}

export const BasicCard = () => {
  return (
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
      tableHeaderProps={{
        tableHeader: "optional table header",
        tableSubHeader: "optional table subheader",
      }}
    />
  )
}
