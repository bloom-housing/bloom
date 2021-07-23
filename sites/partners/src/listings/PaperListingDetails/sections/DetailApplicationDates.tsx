import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import { getDetailFieldDate, getDetailFieldTime } from "./helpers"

const DetailApplicationDates = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.applicationDatesTitle")}
      grid={false}
      inset
    >
      <GridSection columns={3}>
        <GridCell>
          <ViewItem label={t("listings.applicationDeadline")}>
            {listing.applicationDueDate && getDetailFieldDate(listing.applicationDueDate)}
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("listings.applicationDueTime")}>
            {listing.applicationDueTime && getDetailFieldTime(listing.applicationDueTime)}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailApplicationDates
