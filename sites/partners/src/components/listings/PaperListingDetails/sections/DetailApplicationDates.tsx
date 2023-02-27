import React, { useContext } from "react"
import dayjs from "dayjs"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { ViewItem } from "../../../../../../../detroit-ui-components/src/blocks/ViewItem"
import { ListingContext } from "../../ListingContext"
import { ListingMarketingTypeEnum } from "@bloom-housing/backend-core/types"

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
          <ViewItem id="applicationDeadline" label={t("listings.marketingSection.status")}>
            {t(`listings.${listing.marketingType}`)}
          </ViewItem>
        </GridCell>
        {listing.marketingType === ListingMarketingTypeEnum.comingSoon && (
          <GridCell>
            <ViewItem id="applicationDueTime" label={t("listings.marketingSection.date")}>
              {listing.marketingSeason && t(`seasons.${listing.marketingSeason}`)}{" "}
              {listing.marketingDate && dayjs(listing.marketingDate).year()}
              {!listing.marketingSeason && !listing.marketingDate && t("t.none")}
            </ViewItem>
          </GridCell>
        )}
      </GridSection>
    </GridSection>
  )
}

export default DetailApplicationDates
