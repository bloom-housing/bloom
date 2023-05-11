import React from "react"
import dayjs from "dayjs"
import {
  Address,
  Listing,
  ListingReviewOrder,
  UnitsSummarized,
  ListingStatus,
  ApplicationMultiselectQuestion,
} from "@bloom-housing/backend-core/types"
import {
  t,
  ApplicationStatusType,
  StatusBarType,
  AppearanceStyleType,
} from "@bloom-housing/ui-components"
import { ListingCard } from "@bloom-housing/doorway-ui-components"
import { imageUrlFromListing, getSummariesTable } from "@bloom-housing/shared-helpers"

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Next.js bakes env vars at build time
// Thie lets us resolve values at runtime instead
export const getListingServiceUrl = () => {
  let backendApiBase: string

  if (process.env.BACKEND_PROXY_BASE) {
    // try proxy base first
    backendApiBase = process.env.BACKEND_PROXY_BASE
  } else if (process.env.BACKEND_API_BASE) {
    // then backend api base
    backendApiBase = process.env.BACKEND_API_BASE
  } else {
    // fall back on next config value if absolutely necessary
    backendApiBase = process.env.backendApiBase
  }

  return backendApiBase + process.env.LISTINGS_QUERY
}

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

export const disableContactFormOption = (id: string, noPhone: boolean, noEmail: boolean) => {
  if (id === "phone" || id === "text") {
    return noPhone
  }
  return id === "email" && noEmail
}

export const openInFuture = (listing: Listing) => {
  const nowTime = dayjs()
  return listing.applicationOpenDate && nowTime < dayjs(listing.applicationOpenDate)
}

const getListingCardSubtitle = (address: Address) => {
  const { street, city, state, zipCode } = address || {}
  return address ? `${street}, ${city} ${state}, ${zipCode}` : null
}

const getListingTableData = (
  unitsSummarized: UnitsSummarized,
  listingReviewOrder: ListingReviewOrder
) => {
  return unitsSummarized !== undefined
    ? getSummariesTable(unitsSummarized.byUnitTypeAndRent, listingReviewOrder)
    : []
}

export const getListingUrl = (listing: Listing) => {
  if (listing.isExternal) {
    return `/listing/ext/${listing.id}`
  } else {
    return `/listing/${listing.id}/${listing.urlSlug}`
  }
}

export const getListingApplicationStatus = (listing: Listing): StatusBarType => {
  let content = ""
  let subContent = ""
  let formattedDate = ""
  let status = ApplicationStatusType.Open

  if (openInFuture(listing)) {
    const date = listing.applicationOpenDate
    const openDate = dayjs(date)
    formattedDate = openDate.format("MMM D, YYYY")
    content = t("listings.applicationOpenPeriod")
  } else {
    if (listing.status === ListingStatus.closed) {
      status = ApplicationStatusType.Closed
      content = t("listings.applicationsClosed")
    } else if (listing.applicationDueDate) {
      const dueDate = dayjs(listing.applicationDueDate)
      formattedDate = dueDate.format("MMM DD, YYYY")
      formattedDate = formattedDate + ` ${t("t.at")} ` + dueDate.format("h:mmA")

      // if due date is in future, listing is open
      if (dayjs() < dueDate) {
        content = t("listings.applicationDeadline")
      } else {
        status = ApplicationStatusType.Closed
        content = t("listings.applicationsClosed")
      }
    }
  }

  if (formattedDate != "") {
    content = content + `: ${formattedDate}`
  }

  if (listing.reviewOrderType === ListingReviewOrder.firstComeFirstServe) {
    subContent = content
    content = t("listings.applicationFCFS")
  }

  return {
    status,
    content,
    subContent,
  }
}

const generateTableSubHeader = (listing) => {
  if (listing.reviewOrderType !== ListingReviewOrder.waitlist) {
    return {
      content: t("listings.availableUnits"),
      styleType: AppearanceStyleType.success,
      isPillType: true,
    }
  } else if (listing.reviewOrderType === ListingReviewOrder.waitlist) {
    return {
      content: t("listings.waitlist.open"),
      styleType: AppearanceStyleType.primary,
      isPillType: true,
    }
  }
  return null
}

const unitSummariesHeaders = {
  unitType: "t.unitType",
  minimumIncome: "t.minimumIncome",
  rent: "t.rent",
}

export const getListings = (listings: Listing[]) => {
  return listings.map((listing: Listing, index: number) => {
    return getListingCard(listing, index)
  })
}

export const getListingCard = (listing: Listing, index: number) => {
  const uri = getListingUrl(listing)
  const displayIndex: string = (index + 1).toString()
  return (
    <ListingCard
      key={index}
      imageCardProps={{
        imageUrl:
          imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize || "1302")) || "",
        tags: listing.reservedCommunityType
          ? [
              {
                text: t(`listings.reservedCommunityTypes.${listing.reservedCommunityType.name}`),
              },
            ]
          : undefined,
        statuses: [getListingApplicationStatus(listing)],
        description: listing.name,
      }}
      tableProps={{
        headers: unitSummariesHeaders,
        data: getListingTableData(listing.unitsSummarized, listing.reviewOrderType),
        responsiveCollapse: true,
        cellClassName: "px-5 py-3",
      }}
      footerButtons={[
        {
          text: t("t.seeDetails"),
          href: uri,
          ariaHidden: true,
        },
      ]}
      contentProps={{
        contentHeader: {
          content: displayIndex + ". " + listing.name,
          href: uri,
        },
        contentSubheader: { content: getListingCardSubtitle(listing.buildingAddress) },
        tableHeader: generateTableSubHeader(listing),
      }}
    />
  )
}

export const untranslateMultiselectQuestion = (
  data: ApplicationMultiselectQuestion[],
  listing: Listing
) => {
  const multiselectQuestions = listing?.listingMultiselectQuestions ?? []

  data.forEach((datum) => {
    const question = multiselectQuestions.find(
      (elem) => elem.multiselectQuestion.text === datum.key
    )?.multiselectQuestion

    if (question) {
      datum.key = question.untranslatedText ?? question.text

      if (datum.options) {
        datum.options.forEach((option) => {
          const selectedOption = question.options.find((elem) => elem.text === option.key)

          if (selectedOption) {
            option.key = selectedOption.untranslatedText ?? selectedOption.text
          } else if (question.optOutText === option.key) {
            option.key = question.untranslatedOptOutText ?? question.optOutText
          }

          if (option.extraData) {
            option.extraData.forEach((extra) => {
              extra.key = selectedOption.untranslatedText ?? selectedOption.text
            })
          }
        })
      }
    }
  })
}
