import React, { useContext } from "react"
import { t, GridSection, ViewItem } from "@bloom-housing/ui-components"
import { ListingContext } from "../../ListingContext"

const DetailRentalAssistance = () => {
  const listing = useContext(ListingContext)

  return (
    listing?.section8Acceptance !== null && (
      <GridSection
        className="bg-primary-lighter"
        title={t("listings.sections.rentalAssistanceTitle")}
        grid={false}
        tinted
        inset
      >
        <ViewItem label={t("listings.section8AcceptanceQuestion")} className={"mb-2"} />
        <span className="text-base font-semibold pt-4">
          {listing.section8Acceptance ? t("t.yes") : t("t.no")}
        </span>
      </GridSection>
    )
  )
}

export default DetailRentalAssistance
