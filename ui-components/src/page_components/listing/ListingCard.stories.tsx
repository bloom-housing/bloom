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
          unitType: "t.unitType",
          minimumIncome: "t.incomeRange",
          rent: "t.rent",
        },
        data: [{ unitType: "cellA", minimumIncome: "cellB", rent: "cellC" }],
        responsiveCollapse: true,
      }}
      seeDetailsLink={`see-details-link`}
      tableHeaderProps={{
        tableHeader: "optional table header",
        tableSubHeader: "optional table subheader",
      }}
    />
  )
}

export const withStackedTable = () => {
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
          units: { name: "t.unitType" },
          availability: { name: "t.availability" },
          income: { name: "t.incomeRange" },
          rent: { name: "t.rent" },
        },
        stackedData: [
          {
            units: { cellText: "Studio", cellSubText: "23 available", hideMobile: true },
            availability: { cellText: "23", cellSubText: "available" },
            income: { cellText: "$0 to $6,854", cellSubText: "per month" },
            rent: { cellText: "30%", cellSubText: "income" },
          },
          {
            units: { cellText: "1 BR", cellSubText: "3 available" },
            availability: { cellText: "3", cellSubText: "available" },
            income: { cellText: "$2,194 to $6,854", cellSubText: "per month" },
            rent: { cellText: "$1,295", cellSubText: "income" },
          },
        ],
        headersHiddenDesktop: ["availability"],
      }}
      seeDetailsLink={`see-details-link`}
      tableHeaderProps={{
        tableHeader: "optional table header",
        tableSubHeader: "optional table subheader",
        stackedTable: true,
      }}
    />
  )
}
