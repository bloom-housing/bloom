import Button from "../../actions/Button"
import LinkButton from "../../actions/LinkButton"
import Icon, { IconFillColors } from "../../icons/Icon"
import * as React from "react"
import { ListingCard } from "./ListingCard"

export default {
  title: "Listing/ListingCard",
}

const standardImageCardProps = {
  imageUrl: "/images/listing.jpg",
  href: "listing-link",
  tags: [{ text: "reserved community tag" }],
  statuses: [{ content: "status content" }],
}

const standardTableProps = {
  headers: {
    unitType: "t.unitType",
    minimumIncome: "t.incomeRange",
    rent: "t.rent",
  },
  data: [{ unitType: "cellA", minimumIncome: "cellB", rent: "cellC" }],
  responsiveCollapse: true,
}

export const WithStandardTable = () => {
  return (
    <ListingCard
      imageCardProps={{ ...standardImageCardProps }}
      tableProps={{ ...standardTableProps }}
      footerButtons={[{ text: "See Details", href: "see-details-link" }]}
    />
  )
}

export const withStackedTable = () => {
  return (
    <ListingCard
      imageCardProps={{
        imageUrl: "/images/listing.jpg",
        href: "listing-link",
        tags: [{ text: "reserved community tag" }],
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
      footerButtons={[{ text: "See Details", href: "see-details-link" }]}
      stackedTable={true}
    />
  )
}

export const WithHeaders = () => {
  return (
    <ListingCard
      imageCardProps={{ ...standardImageCardProps }}
      tableProps={{ ...standardTableProps }}
      footerButtons={[{ text: "See Details", href: "see-details-link" }]}
      contentProps={{
        contentHeader: { text: "Optional content header" },
        contentSubheader: { text: "Optional content subheader" },
        tableHeader: { text: "Optional table header" },
        tableSubheader: { text: "Optional table subheader" },
      }}
    />
  )
}

export const WithTags = () => {
  return (
    <ListingCard
      imageCardProps={{ ...standardImageCardProps }}
      tableProps={{ ...standardTableProps }}
      footerButtons={[{ text: "See Details", href: "see-details-link" }]}
      contentProps={{
        contentHeader: { text: "Optional content header" },
        contentSubheader: { text: "Optional content subheader" },
      }}
      cardTags={[
        { text: "Tag 1 text" },
        { text: "Tag 2 text" },
        { text: "A tag with a longer name" },
      ]}
    />
  )
}

export const WithTagsAndHeaders = () => {
  return (
    <ListingCard
      imageCardProps={{ ...standardImageCardProps }}
      tableProps={{ ...standardTableProps }}
      footerButtons={[{ text: "See Details", href: "see-details-link" }]}
      contentProps={{
        contentHeader: { text: "Optional content header" },
        contentSubheader: { text: "Optional content subheader" },
        tableHeader: { text: "Optional table header" },
        tableSubheader: { text: "Optional table subheader" },
      }}
      cardTags={[
        { text: "Tag 1 text" },
        { text: "Tag 2 text" },
        { text: "A tag with a longer name" },
      ]}
    />
  )
}
export const WithHeadersContent = () => {
  return (
    <ListingCard
      imageCardProps={{ ...standardImageCardProps }}
      tableProps={{ ...standardTableProps }}
      footerButtons={[{ text: "See Details", href: "see-details-link" }]}
      contentProps={{
        contentHeader: { text: "Property Listing" },
        contentSubheader: { text: "Street Address, Local City ST 12345" },
        tableHeader: { text: "Open Waitlist & Available Units" },
        tableSubheader: { text: "Includes priority units for mobility impairments" },
      }}
    />
  )
}

export const NoContent = () => {
  return (
    <ListingCard
      imageCardProps={{
        imageUrl: "/images/listing.jpg",
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
        imageUrl: "/images/listing.jpg",
        href: "listing-link",
        tags: [{ text: "Habitat for Humanity" }],
        statuses: [{ content: "status content" }],
      }}
      footerButtons={[{ text: "See Details", href: "see-details-link" }]}
    >
      {exampleCustomContent()}
    </ListingCard>
  )
}

export const MultipleFooterButtons = () => {
  return (
    <ListingCard
      imageCardProps={{ ...standardImageCardProps }}
      tableProps={{ ...standardTableProps }}
      footerButtons={[
        { text: "See Details", href: "see-details-link" },
        { text: "Apply", href: "apply-link" },
      ]}
      contentProps={{
        tableHeader: { text: "Optional table header" },
        tableSubheader: { text: "Optional table subheader" },
      }}
    />
  )
}

export const MultipleSpreadFooterButtons = () => {
  return (
    <ListingCard
      imageCardProps={{ ...standardImageCardProps }}
      tableProps={{ ...standardTableProps }}
      footerButtons={[
        { text: "See Details", href: "see-details-link" },
        { text: "Apply", href: "apply-link" },
      ]}
      footerContainerClass={"flex justify-between"}
      contentProps={{
        tableHeader: { text: "Optional table header" },
        tableSubheader: { text: "Optional table subheader" },
      }}
    />
  )
}

const getCustomFooter = () => {
  return (
    <div className={"flex justify-between"}>
      <span className={"w-5"}>
        <Button className="mx-2 p-3 mb-2 rounded-full bg-primary-dark border-primary-dark">
          <Icon symbol={"like"} size={"medium"} fill={IconFillColors.white} />
        </Button>
      </span>
      <LinkButton href={"see-details-link"}>See Details</LinkButton>
    </div>
  )
}

export const CustomFooter = () => {
  return (
    <ListingCard
      imageCardProps={{ ...standardImageCardProps }}
      tableProps={{ ...standardTableProps }}
      footerContent={getCustomFooter()}
      footerContainerClass={"flex justify-between"}
      contentProps={{
        tableHeader: { text: "Optional table header" },
        tableSubheader: { text: "Optional table subheader" },
      }}
    />
  )
}
