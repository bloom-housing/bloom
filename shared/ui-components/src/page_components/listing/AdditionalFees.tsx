import * as React from "react"
import { Listing } from "@bloom-housing/core/src/listings"
import t from "@bloom-housing/ui-components/src/helpers/translator"

export interface AdditionalFeesProps {
  listing: Listing
}

const AdditionalFees = (props: AdditionalFeesProps) => (
  <div className="bg-gray-100 p-6">
    <p className="mb-3 uppercase font-semibold tracking-wider">{t("listings.additionalFees")}</p>
    <div className="flex text-sm">
      <div className="flex-1">
        <div class="text-base">{t("listings.applicationFee")}</div>
        <div className="text-xl font-bold">${props.listing.applicationFee}</div>
        <div>{t("listings.applicationPerApplicantAgeDescription")}</div>
        <div>{t("listings.applicationFeeDueAt")}</div>
      </div>
      <div className="flex-1">
        <div class="text-base">{t("t.deposit")}</div>
        <div className="text-xl font-bold">
          {props.listing.depositMax && props.listing.depositMin == props.listing.depositMax
            ? `$${props.listing.depositMin}`
            : `$${props.listing.depositMin}–$${props.listing.depositMax}`}
        </div>
        <div>{t("listings.depositOrMonthsRent")}</div>
      </div>
    </div>

    {props.listing.costsNotIncluded && (
      <p className="text-sm mt-6">{props.listing.costsNotIncluded}</p>
    )}
  </div>

  /*
  .content-tile.feature-tile
  .content-card.bg-dust
    h5.content-card_title Additional Fees
    .row.collapse.margin-bottom
      .small-6.columns.padding-right.padding-bottom
        span.t-small Application Fee
        p.t-delta.no-margin.t-bold
          | {{::$ctrl.parent.listing.application_fee | currency:"$":2}}
        span.content-label.t-small
          | 
        span.t-tiny.d-block
          | Due at interview
      .small-6.columns.padding-bottom
        span.t-small Deposit
        p.t-delta.no-margin.t-bold
          | {{::$ctrl.parent.listing.deposit_min | currency:"$":0}}
          span ng-if="$ctrl.parent.listing.deposit_max && $ctrl.parent.listing.deposit_max != $ctrl.parent.listing.deposit_min"
            | &ndash;{{ $ctrl.parent.listing.deposit_max | currency:"$":0 }}
        span.content-label.t-small
          | or one month's rent
        span.t-tiny.d-block ng-if="$ctrl.listingIsBMR()"
          | May be higher for lower credit scores
*/
)

export default AdditionalFees
