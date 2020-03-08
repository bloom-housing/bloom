import * as React from "react"
import { Listing } from "@bloom-housing/core"
import t from "@bloom-housing/ui-components/src/helpers/translator"

export interface AdditionalFeesProps {
  listing: Listing
}

const AdditionalFees = (props: AdditionalFeesProps) => (
  <div className="bg-gray-100 p-6">
    <p className="mb-3 uppercase font-semibold tracking-wider">{t("listings.additionalFees")}</p>
    <div className="flex text-sm">
      <div className="flex-1">
        <div className="text-base">{t("listings.applicationFee")}</div>
        <div className="text-xl font-bold">${props.listing.applicationFee}</div>
        <div>{t("listings.applicationPerApplicantAgeDescription")}</div>
        <div>{t("listings.applicationFeeDueAt")}</div>
      </div>
      <div className="flex-1">
        <div className="text-base">{t("t.deposit")}</div>
        <div className="text-xl font-bold">
          {props.listing.depositMax && props.listing.depositMin != props.listing.depositMax
            ? `$${props.listing.depositMin}–$${props.listing.depositMax}`
            : `$${props.listing.depositMin}`}
        </div>
        <div>{t("listings.depositOrMonthsRent")}</div>
      </div>
    </div>

    {props.listing.costsNotIncluded && (
      <p className="text-sm mt-6">{props.listing.costsNotIncluded}</p>
    )}
  </div>
)

export default AdditionalFees
