import * as React from "react"
import { ListingCard } from "./ListingCard"

export default {
  title: "Listing/ListingCard",
}

export const BasicCard = () => {
  return (
    <ListingCard
      imageCardProps={{
        imageUrl:
          "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=640:*",
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
        imageUrl:
          "https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/old-oakland-kim-cole-3-1024x768_gdwmzt.jpg",
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

export const NoContent = () => {
  return (
    <ListingCard
      imageCardProps={{
        imageUrl:
          "https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/old-oakland-kim-cole-3-1024x768_gdwmzt.jpg",
        subtitle: "subtitle",
        title: "title",
        href: "listing-link",
      }}
    />
  )
}

const exampleCustomContent = () => {
  const getHeader = (header: string) => {
    return (
      <div
        className={
          "font-sans font-semibold text-base uppercase text-gray-750 tracking-wider border-0 border-b pb-2 mb-2 md:mt-4"
        }
      >
        {header}
      </div>
    )
  }
  const getContentRow = (prefix: string, content: string) => {
    return (
      <div>
        <span className={"font-semibold"}>{prefix}</span> {content}
      </div>
    )
  }
  return (
    <div className={"text-gray-750"}>
      <div className={"font-alt-sans font-semibold text-base mb-2 text-gray-900"}>
        Available units
      </div>
      {getHeader("Units")}
      {getContentRow("2BR:", "2 available")}
      {getContentRow("3BR:", "5 available")}
      {getContentRow("4BR:", "1 available")}
      {getHeader("Payments")}
      <div>
        No down payment, but you do need to complete 500 hours of sweat equity. Your monthly payment
        will be 30% of your income.
      </div>
      <div className={"mt-4  border-0 border-b pb-2 mb-2"}>
        You will need to attend an information session.
      </div>
    </div>
  )
}

export const CustomContent = () => {
  return (
    <ListingCard
      imageCardProps={{
        imageUrl:
          "https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/old-oakland-kim-cole-3-1024x768_gdwmzt.jpg",
        subtitle: "subtitle",
        title: "title",
        href: "listing-link",
        tagLabel: "Habitat for Humanity",
        statuses: [{ content: "status content" }],
      }}
      seeDetailsLink={`see-details-link`}
    >
      {exampleCustomContent()}
    </ListingCard>
  )
}
