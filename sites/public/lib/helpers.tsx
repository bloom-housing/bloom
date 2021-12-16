import { ELIGIBILITY_ROUTE, ELIGIBILITY_SECTIONS } from "./constants"
import moment from "moment"
import { Address, Listing } from "@bloom-housing/backend-core/types"
import {
  t,
  ListingCard,
  imageUrlFromListing,
  getSummariesTableFromUnitSummary,
  getSummariesTableFromUnitsSummary,
  IconTypes,
  IconSize,
  IconProps,
} from "@bloom-housing/ui-components"
import React from "react"

export const eligibilityRoute = (page: number) =>
  `/${ELIGIBILITY_ROUTE}/${ELIGIBILITY_SECTIONS[page]}`

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const getGenericAddress = (bloomAddress: Address) => {
  return bloomAddress
    ? {
        city: bloomAddress.city,
        street: bloomAddress.street,
        street2: bloomAddress.street2,
        state: bloomAddress.state,
        zipCode: bloomAddress.zipCode,
        latitude: bloomAddress.latitude,
        longitude: bloomAddress.longitude,
        placeName: bloomAddress.placeName,
      }
    : null
}

export const openInFuture = (listing: Listing) => {
  const nowTime = moment()
  return listing.applicationOpenDate && nowTime < moment(listing.applicationOpenDate)
}

const getListingCardSubtitle = (address: Address) => {
  const { street, city, state, zipCode } = address || {}
  return address ? `${street}, ${city} ${state}, ${zipCode}` : null
}

export const getImageTagLabelFromListing = (listing: Listing) => {
  const reservedCommunityTypeName = listing.reservedCommunityType?.name
  return reservedCommunityTypeName
    ? t(`listings.reservedCommunityTypes.${reservedCommunityTypeName}`)
    : undefined
}

export const getImageTagIconFromListing = (listing: Listing): IconProps | null => {
  const reservedCommunityTypeName = listing.reservedCommunityType?.name

  // The "specialNeeds" adds an accessible icon to the tag.
  if (reservedCommunityTypeName === "specialNeeds") {
    const tagIconSymbol: IconTypes = "accessible"
    const tagIconSize: IconSize = "medium"
    const tagIconFill = "#000000"
    return {
      symbol: tagIconSymbol,
      size: tagIconSize,
      fill: tagIconFill,
    }
  }

  return null
}

const getListingTableData = (listing: Listing) => {
  if (listing.unitsSummary !== undefined && listing.unitsSummary.length > 0) {
    return getSummariesTableFromUnitsSummary(listing.unitsSummary)
  } else if (listing.unitsSummarized !== undefined) {
    return getSummariesTableFromUnitSummary(listing.unitsSummarized.byUnitTypeAndRent)
  }
  return []
}

export const getListings = (listings) => {
  const unitSummariesHeaders = {
    unitType: t("t.unitType"),
    rent: t("t.rent"),
    availability: t("t.availability"),
  }
  return listings.map((listing: Listing, index) => {
    return (
      <ListingCard
        key={index}
        imageCardProps={{
          imageUrl:
            imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize || "1302")) || "",
          subtitle: getListingCardSubtitle(listing.buildingAddress),
          title: listing.name,
          href: `/listing/${listing.id}/${listing.urlSlug}`,
          tagLabel: getImageTagLabelFromListing(listing),
          tagIcon: getImageTagIconFromListing(listing),
        }}
        tableProps={{
          headers: unitSummariesHeaders,
          data: getListingTableData(listing),
          responsiveCollapse: true,
          cellClassName: "px-5 py-3",
        }}
        seeDetailsLink={`/listing/${listing.id}/${listing.urlSlug}`}
        detailsLinkClass="float-right"
        tableHeaderProps={{
          tableHeader: listing.showWaitlist ? t("listings.waitlist.open") : null,
        }}
      />
    )
  })
}

export const usToIntlPhone = (usPhoneNumber: string): string => {
  return usPhoneNumber.replace(/\((\d{3})\) (\d{3})-(\d{4})/, "+1$1$2$3")
}

export const intlToUsPhone = (intlPhoneNumber: string): string => {
  return intlPhoneNumber.replace(/\+1(\d{10})/, "$1")
}
