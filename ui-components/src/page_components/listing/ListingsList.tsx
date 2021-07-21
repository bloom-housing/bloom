import * as React from "react"
import { ImageCard } from "../../blocks/ImageCard"
import { Listing } from "@bloom-housing/backend-core/types"
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
    let formattedDate = ""
    let appStatus = ApplicationStatusType.Open

    if (openDateState(listing)) {
      const date = listing.applicationOpenDate
      const openDate = moment(date)
      formattedDate = openDate.format("MMMM D, YYYY")

      // XXX: the line below is logic that was previously in /ui-components/src/notifications/ApplicationStatus.tsx
      // `vivid` is a prop on ApplicationStatus that determines background color and text size
      // but it was also used to determine content
      // what is the corresponding date to determine content here?
      //
      // content = vivid ? t("listings.comingSoon") : t("listings.applicationOpenPeriod")
      //
      // for now, use listings.comingSoon
      content = t("listings.comingSoon")
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
      } else {
        content = t("listings.applicationFCFS")
      }
    }

    if (formattedDate != "") {
      content = content + `: ${formattedDate}`
    }

    console.log(listing)

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
          />
        </div>
        <div className="listings-row_content">
          {listing.showWaitlist && (
            <h4 className="listings-row_title">{t("listings.waitlist.open")}</h4>
          )}
          <div className="listings-row_table">
            {unitSummaries && (
              <>
                {listing.reservedCommunityType && `heblo`}
                <GroupedTable
                  headers={unitSummariesHeaders}
                  data={unitSummaries}
                  responsiveCollapse={true}
                  cellClassName="px-5 py-3"
                />
              </>
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
