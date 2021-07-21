import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"
import moment from "moment"

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
            {listing.applicationDueDate &&
              moment(new Date(listing?.applicationDueDate)).utc().format("MM/DD/YYYY")}
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("listings.applicationDueTime")}>
            {listing.applicationDueTime &&
              moment(new Date(listing?.applicationDueTime)).format("hh:mm:ss A")}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailApplicationDates
