import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { ViewItem } from "../../../../../../detroit-ui-components/src/blocks/ViewItem"
import { ListingContext } from "../../ListingContext"
import { getDetailBoolean } from "./helpers"

const DetailVerification = () => {
  const listing = useContext(ListingContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("listings.sections.verification")}
      grid={false}
      inset
    >
      <GridSection columns={3}>
        <GridCell span={2}>
          <ViewItem id="isVerified" label={t("listings.sections.isVerified")}>
            {getDetailBoolean(listing?.isVerified)}
          </ViewItem>
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default DetailVerification
