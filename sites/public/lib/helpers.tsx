import React from "react"
import { ELIGIBILITY_ROUTE, ELIGIBILITY_SECTIONS } from "./constants"

export const eligibilityRoute = (page: number) =>
  `/${ELIGIBILITY_ROUTE}/${ELIGIBILITY_SECTIONS[page]}`
import dayjs from "dayjs"
import { Address, Listing } from "@bloom-housing/backend-core/types"
import {
  t,
  ListingCard,
  IconTypes,
  IconSize,
  IconProps,
  TableHeaders,
} from "@bloom-housing/ui-components"
import { imageUrlFromListing, listingFeatures } from "@bloom-housing/shared-helpers"

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
  const nowTime = dayjs()
  return listing.applicationOpenDate && nowTime < dayjs(listing.applicationOpenDate)
}

const getListingCardSubtitle = (address: Address) => {
  const { street, city, state, zipCode } = address || {}
  return address ? `${street}, ${city} ${state}, ${zipCode}` : null
}

export const accessibilityFeaturesExist = (listing: Listing) => {
  if (!listing.features) return false
  let featuresExist = false
  Object.keys(listingFeatures).map((feature) => {
    if (listing.features[feature]) {
      featuresExist = true
    }
  })
  return featuresExist
}

export const getImageTagLabelFromListing = (listing: Listing) => {
  return listing?.isVerified ? t("listings.verifiedListing") : undefined
}

export const getImageTagIconFromListing = (listing: Listing): IconProps | null => {
  if (listing?.isVerified) {
    const tagIconSymbol: IconTypes = "badgeCheck"
    const tagIconSize: IconSize = "medium"
    const tagIconFill = "#193154"
    return {
      symbol: tagIconSymbol,
      size: tagIconSize,
      fill: tagIconFill,
    }
  }
  return null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getListingTableData = (listing: Listing) => {
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

interface UnitSummaryTable {
  headers: TableHeaders
  data: Record<string, React.ReactNode>[]
}

export const getUnitGroupSummary = (listing: Listing): UnitSummaryTable => {
  const groupedUnitHeaders = {
    unitType: t("t.unitType"),
    rent: t("t.rent"),
    availability: t("t.availability"),
    ami: t("listings.unit.ami"),
  }
  let groupedUnitData: Record<string, React.ReactNode>[] = null

  if (listing.unitGroups !== undefined && listing.unitGroups.length > 0) {
    // unit group summary
    groupedUnitData = listing.unitSummaries.unitGroupSummary.map((group) => {
      let rentRange = null
      let rentAsPercentIncomeRange = null
      if (group.rentRange && group.rentRange.min === group.rentRange.max) {
        rentRange = group.rentRange.min
      } else if (group.rentRange) {
        rentRange = `${group.rentRange.min} - ${group.rentRange.max}`
      }

      if (rentRange) {
        rentRange = (
          <span>
            <strong>{rentRange}</strong> {t("t.perMonth")}
          </span>
        )
      }

      if (
        group.rentAsPercentIncomeRange &&
        group.rentAsPercentIncomeRange.min === group.rentAsPercentIncomeRange.max
      ) {
        rentAsPercentIncomeRange = group.rentAsPercentIncomeRange.min
      } else if (group.rentAsPercentIncomeRange) {
        rentAsPercentIncomeRange = `${group.rentAsPercentIncomeRange.min} - ${group.rentAsPercentIncomeRange.max}`
      }

      if (rentAsPercentIncomeRange) {
        rentAsPercentIncomeRange = (
          <span>
            <strong>{rentAsPercentIncomeRange}%</strong> {t("t.income")}
          </span>
        )
      }

      let availability = null

      if (group.unitVacancies > 0) {
        availability = (
          <div>
            <strong>{group.unitVacancies} </strong>
            {group.unitVacancies === 1 ? t("listings.vacantUnit") : t("listings.vacantUnits")}
            {` ${t("t.&")}`}
          </div>
        )
      }

      availability = (
        <>
          {availability}
          <strong>
            {group.openWaitlist ? t("listings.waitlist.open") : t("listings.waitlist.closed")}
          </strong>
        </>
      )

      let ami = null

      if (
        group.amiPercentageRange &&
        group.amiPercentageRange.min === group.amiPercentageRange.max
      ) {
        ami = `${group.amiPercentageRange.min}%`
      } else if (group.amiPercentageRange) {
        ami = `${group.amiPercentageRange.min} - ${group.amiPercentageRange.max}%`
      }

      let rent: React.ReactNode = null

      if (rentRange && rentAsPercentIncomeRange) {
        rent = (
          <>
            {rentRange}, {rentAsPercentIncomeRange}
          </>
        )
      } else if (rentRange) {
        rent = rentRange
      } else if (rentAsPercentIncomeRange) {
        rent = rentAsPercentIncomeRange
      }

      return {
        unitType: (
          <>
            {group.unitTypes
              .map<React.ReactNode>((type) => (
                <strong key={type}>{t(`listings.unitTypes.${type}`)}</strong>
              ))
              .reduce((acc, curr) => [acc, ", ", curr])}
          </>
        ),
        rent,
        availability,
        ami: <strong>{ami}</strong>,
      }
    })
  }

  return {
    headers: groupedUnitHeaders,
    data: groupedUnitData,
  }
}

export const getHmiSummary = (listing: Listing): UnitSummaryTable => {
  let hmiHeaders: TableHeaders
  let hmiData: Record<string, React.ReactNode>[] = null

  if (listing.unitGroups !== undefined && listing.unitGroups.length > 0) {
    // hmi summary
    const { columns, rows } = listing.unitSummaries.householdMaxIncomeSummary
    // hmiHeaders
    for (const key in columns) {
      if (hmiHeaders === undefined) {
        hmiHeaders = {}
      }

      if (key === "householdSize") {
        hmiHeaders[key] = t(`listings.householdSize`)
      } else {
        hmiHeaders[key] = t("listings.percentAMIUnit", { percent: key.replace("percentage", "") })
      }
    }
    // hmiData
    hmiData = rows.map((row) => {
      const obj = {}

      for (const key in row) {
        if (key === "householdSize") {
          obj[key] = (
            <>
              <strong>{row[key]}</strong> {row[key] === "1" ? t("t.person") : t("t.people")}
            </>
          )
        } else {
          obj[key] = (
            <>
              <strong>${row[key].toLocaleString("en")}</strong> {t("t.perYear")}
            </>
          )
        }
      }

      return obj
    })
  }

  return {
    headers: hmiHeaders,
    data: hmiData,
  }
}
