import * as React from "react"
import { ImageCard } from "../../blocks/ImageCard"
import { Listing, ListingReviewOrder } from "@bloom-housing/backend-core/types"
import { LinkButton } from "../../actions/LinkButton"
import { getSummariesTable } from "../../helpers/tableSummaries"
import { GroupedTable, GroupedTableGroup } from "../../tables/GroupedTable"
import { imageUrlFromListing } from "../../helpers/photos"
import { t } from "../../helpers/translator"
import moment from "moment"
import { openDateState } from "../../helpers/state"
import { ApplicationStatusType } from "../../global/ApplicationStatusType"
import "./ListingsList.scss"

export interface ListingsProps {
  listings: Listing[]
}

const ListingsList = (props: ListingsProps) => {
  const listings = props.listings

  const listItems = listings.map((listing: Listing) => {
    const imageUrl =
      imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize || "1302")) || ""
    const unitSummariesHeaders = {
      unitType: t("t.unitType"),
      minimumIncome: t("t.minimumIncome"),
      rent: t("t.rent"),
    }

    let unitSummaries = [] as GroupedTableGroup[]
    if (listing.unitsSummarized !== undefined) {
      unitSummaries = getSummariesTable(listing.unitsSummarized.byUnitTypeAndRent)
    }

    // address as subtitle
    const { street, city, state, zipCode } = listing.buildingAddress || {}
    const subtitle = `${street}, ${city} ${state}, ${zipCode}`
    let content = ""
    let subContent = ""
    let formattedDate = ""
    let appStatus = ApplicationStatusType.Open

    if (openDateState(listing)) {
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

    return (
      <article key={listing.id} className="listings-row">
        <div className="listings-row_figure">
          <ImageCard
            title={listing.name}
            subtitle={subtitle}
            imageUrl={imageUrl}
            href={`/listing/${listing.id}/${listing.urlSlug}`}
            appStatus={appStatus}
            appStatusContent={content}
            appStatusSubContent={subContent}
            tagLabel={
              listing.reservedCommunityType
                ? t(`listings.reservedCommunityTypes.${listing.reservedCommunityType.name}`)
                : undefined
            }
          />
        </div>
        <div className="listings-row_content">
          {listing.showWaitlist && (
            <h4 className="listings-row_title">{t("listings.waitlist.open")}</h4>
          )}
          <div className="listings-row_table">
            {unitSummaries && (
              <GroupedTable
                headers={unitSummariesHeaders}
                data={unitSummaries}
                responsiveCollapse={true}
                cellClassName="px-5 py-3"
              />
            )}
          </div>
          <LinkButton href={`/listing/${listing.id}/${listing.urlSlug}`}>
            {t("t.seeDetails")}
          </LinkButton>
        </div>
      </article>
    )
  })

  return <>{listItems}</>
}

export { ListingsList as default, ListingsList }
