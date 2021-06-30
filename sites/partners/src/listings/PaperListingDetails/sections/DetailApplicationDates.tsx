import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailApplicationDates = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-ligher"
      title={t("listings.sections.applicationDatesTitle")}
      grid={false}
      inset
    >
      <GridSection columns={3}>
        <GridCell>
          <ViewItem label={t("listings.applicationDeadline")}>
            {listing.applicationDueDate}
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("listings.applicationDueTime")}>{listing.applicationDueTime}</ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailApplicationDates
