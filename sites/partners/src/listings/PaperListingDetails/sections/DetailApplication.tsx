import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailApplication = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection className="bg-primary-lighter" grid={false} inset>
      <GridSection columns={2}>
        <GridCell>
          <ViewItem label={t("listings.applicationDeadline")}>
            {new Date(listing.applicationDueDate).toDateString()}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailApplication
