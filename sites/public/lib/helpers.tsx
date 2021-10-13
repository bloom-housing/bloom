import moment from "moment"
import {
  Address,
  Listing,
  ListingReviewOrder,
  UnitsSummarized,
} from "@bloom-housing/backend-core/types"
import {
  t,
  ListingCard,
  imageUrlFromListing,
  ApplicationStatusType,
  getSummariesTable,
  StatusBarType,
} from "@bloom-housing/ui-components"

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

const getListingTableData = (unitsSummarized: UnitsSummarized) => {
  return unitsSummarized !== undefined ? getSummariesTable(unitsSummarized.byUnitTypeAndRent) : []
}

const getListingImageCardStatus = (listing: Listing): StatusBarType => {
  let content = ""
  let subContent = ""
  let formattedDate = ""
  let appStatus = ApplicationStatusType.Open

  if (openInFuture(listing)) {
    const date = listing.applicationOpenDate
    const openDate = moment(date)
    formattedDate = openDate.format("MMM. D, YYYY")
    content = t("listings.applicationOpenPeriod")
  } else {
    if (listing.applicationDueDate) {
      const dueDate = moment(listing.applicationDueDate)
      const dueTime = moment(listing.applicationDueTime)
      formattedDate = dueDate.format("MMM. DD, YYYY")

      if (listing.applicationDueTime) {
        formattedDate = formattedDate + ` ${t("t.at")} ` + dueTime.format("h:mm A")
      }

      // if due date is in future, listing is open
      if (moment() < dueDate) {
        content = t("listings.applicationDeadline")
      } else {
        appStatus = ApplicationStatusType.Closed
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
    status: appStatus,
    content,
    subContent,
  }
}

export const getListings = (listings) => {
  const unitSummariesHeaders = {
    unitType: "t.unitType",
    minimumIncome: "t.minimumIncome",
    rent: "t.rent",
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
          tagLabel: listing.reservedCommunityType
            ? t(`listings.reservedCommunityTypes.${listing.reservedCommunityType.name}`)
            : undefined,
          statuses: [getListingImageCardStatus(listing)],
        }}
        tableProps={{
          headers: unitSummariesHeaders,
          data: getListingTableData(listing.unitsSummarized),
          responsiveCollapse: true,
          cellClassName: "px-5 py-3",
        }}
        seeDetailsLink={`/listing/${listing.id}/${listing.urlSlug}`}
        tableHeaderProps={{
          tableHeader: listing.showWaitlist ? t("listings.waitlist.open") : null,
        }}
      />
    )
  })
}
