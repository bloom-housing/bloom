import * as React from "react"
import { AppearanceStyleType, Icon, LinkButton } from "@bloom-housing/ui-components"
import { BADGES } from "../../../.storybook/constants"
import { ListingCard } from "./ListingCard"
import ListingCardDocumentation from "./ListingCard.docs.mdx"

export default {
  title: "Listing/ListingCard 🚩",
  id: "page-components/listing-card",
  component: ListingCard,
  parameters: {
    docs: {
      page: ListingCardDocumentation,
    },
    badges: [BADGES.GEN2],
  },
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
  data: [
    {
      unitType: { content: "Row 1 cellA" },
      minimumIncome: { content: "Row 1 cellB" },
      rent: { content: <strong>Row 1 cellC</strong> },
    },
    {
      unitType: { content: "Row 2 cellA" },
      minimumIncome: { content: "Row 2 cellB" },
      rent: { content: <strong>Row 2 cellC</strong> },
    },
  ],
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
            units: { cellText: "Studio", cellSubText: "23 available", hideSubTextMobile: true },
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
      imageCardProps={{ ...standardImageCardProps, href: undefined }}
      tableProps={{ ...standardTableProps }}
      footerButtons={[{ text: "See Details", href: "see-details-link", ariaHidden: true }]}
      contentProps={{
        contentHeader: { content: "Optional content header", href: "listing-link" },
        contentSubheader: { content: "Optional content subheader" },
        tableHeader: { content: "Optional table header" },
        tableSubheader: { content: "Optional table subheader" },
      }}
    />
  )
}

export const WithPillHeader = () => {
  return (
    <ListingCard
      imageCardProps={{ ...standardImageCardProps, href: undefined }}
      tableProps={{ ...standardTableProps }}
      footerButtons={[{ text: "See Details", href: "see-details-link", ariaHidden: true }]}
      contentProps={{
        contentHeader: { content: "Optional content header", href: "listing-link" },
        contentSubheader: { content: "Optional content subheader" },
        tableHeader: { content: "Optional table header", isPillType: true },
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
        contentHeader: { content: "Optional content header" },
        contentSubheader: { content: "Optional content subheader" },
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
        contentHeader: { content: "Optional content header" },
        contentSubheader: { content: "Optional content subheader" },
        tableHeader: { content: "Optional table header" },
        tableSubheader: { content: "Optional table subheader" },
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
        contentHeader: { content: "Property Listing" },
        contentSubheader: { content: "Street Address, Local City ST 12345" },
        tableHeader: { content: "Open Waitlist & Available Units" },
        tableSubheader: { content: "Includes priority units for mobility impairments" },
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
      <div className={"font-alt-sans font-semibold text-base mb-2 text-gray-950"}>
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
        tableHeader: { content: "Optional table header" },
        tableSubheader: { content: "Optional table subheader" },
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
        tableHeader: { content: "Optional table header" },
        tableSubheader: { content: "Optional table subheader" },
      }}
    />
  )
}

const getCustomFooter = () => {
  return (
    <div className={"flex justify-between"}>
      <span className={"w-5 flex items-center"}>
        <Icon symbol={"like"} size={"large"} aria-label={"favorite"} />
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
        tableHeader: { content: "Optional table header" },
        tableSubheader: { content: "Optional table subheader" },
      }}
    />
  )
}

export const detroitStyle = () => {
  const cssVarsOverride = `
    .listing-card-overrides {
      --bloom-font-sans: Montserrat;
      --bloom-font-alt-sans: var(--bloom-font-sans);
      --bloom-color-primary: rgb(41,126,115);
      --bloom-color-primary-dark: rgb(0,68,69);
      --primary-appearance-hover-background-color: white;
      --primary-appearance-hover-label-color: var(--bloom-color-primary-dark);
      --outlined-appearance-hover-background-color: var(--bloom-color-primary);
      --outlined-appearance-hover-border-color: var(--bloom-color-primary);
      --card-header-color: var(--bloom-color-primary-dark);
    }

    .listing-card-overrides table {
      font-family: var(--bloom-font-sans);
    }

    .listing-card-overrides .image-card {
      --tags-justify-mobile: flex-end;
      --tags-justify-desktop: flex-end;
      --border-radius: 24px;
      --image-height: 340px;
      --normal-font-size: var(--bloom-font-size-base);
    }
    .listing-card-overrides .tag {
      --card-tag-padding: var(--bloom-s2) var(--bloom-s3);
      --normal-padding: var(--bloom-s2) var(--bloom-s3);
      --label-weight: 700;
    }

    .listing-card-overrides .listings-row {
      --tags-flex-order: 2;
    }

    .listing-card-overrides .button {
      --normal-rounded: 60px;
      --normal-padding: 0.5rem 1rem;
      --normal-font-size: var(--bloom-font-size-base);
      --label-letter-spacing: normal;
      --label-transform: none;
    }
  `

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
        rel="stylesheet"
      ></link>
      <div className="listing-card-overrides">
        <ListingCard
          imageCardProps={{
            imageUrl: "https://detroit-public-dev.netlify.app/images/detroitDefault.png",
            href: "listing-link",
            tags: [
              {
                iconType: "calendar",
                iconColor: "white",
                text: "Coming Soon Fall 2022",
                styleType: AppearanceStyleType.closed,
              },
            ],
          }}
          tableProps={{ ...standardTableProps }}
          footerButtons={[{ text: "See Details", href: "see-details-link" }]}
          contentProps={{
            contentHeader: { content: "Optional content header" },
            contentSubheader: { content: "Optional content subheader" },
          }}
          cardTags={[
            { text: "Tag 1 text" },
            { text: "Tag 2 text", styleType: AppearanceStyleType.info },
            {
              text: "A tag with a longer name",
              iconType: "phone",
              iconColor: "white",
              styleType: AppearanceStyleType.primary,
            },
          ]}
        />
        <style>{cssVarsOverride}</style>
      </div>
    </>
  )
}
