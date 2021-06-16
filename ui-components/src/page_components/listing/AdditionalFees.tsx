import * as React from "react"
import { Listing } from "@bloom-housing/backend-core/types"
import { t } from "../../helpers/translator"

export interface AdditionalFeesProps {
  listing: Listing
}

const AdditionalFees = (props: AdditionalFeesProps) => {
  const getDeposit = () => {
    const min = props.listing.depositMin
    const max = props.listing.depositMax
    if (min && max && min !== max) {
      return `$${min} – $${max}`
    } else if (min) return `$${min}`
    else return `$${max}`
  }
  return (
    <div className="info-card bg-gray-100 border-0">
      <p className="info-card__title">{t("listings.sections.additionalFees")}</p>
      <div className="info-card__columns text-sm">
        {props.listing.applicationFee && (
          <div className="info-card__column">
            <div className="text-base">{t("listings.applicationFee")}</div>
            <div className="text-xl font-bold">${props.listing.applicationFee}</div>
            <div>{t("listings.applicationPerApplicantAgeDescription")}</div>
            <div>{t("listings.applicationFeeDueAt")}</div>
          </div>
        )}
        {(props.listing.depositMin || props.listing.depositMax) && (
          <div className="info-card__column">
            <div className="text-base">{t("t.deposit")}</div>
            <div className="text-xl font-bold">{getDeposit()}</div>
            <div>{t("listings.depositOrMonthsRent")}</div>
          </div>
        )}
      </div>

      {props.listing.costsNotIncluded && (
        <p className="text-sm mt-6">{props.listing.costsNotIncluded}</p>
      )}
    </div>
  )
}

export { AdditionalFees as default, AdditionalFees }
