import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

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
            {new Date(listing.applicationDueDate).toDateString()}
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("listings.applicationDueTime")}>
            {listing.applicationDueTime &&
              new Date(listing.applicationDueTime).toLocaleTimeString()}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailApplicationDates
