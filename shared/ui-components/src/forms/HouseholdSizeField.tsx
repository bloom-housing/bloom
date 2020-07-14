import React from "react"
import { Listing } from "@bloom-housing/core"
import { t } from "../helpers/translator"
import ErrorMessage from "./ErrorMessage"

export interface HouseholdSizeFieldProps {
  listing: Listing
  householdSize: number
  validate: boolean
  register: any
  error: any
}

const HouseholdSizeField = (props: HouseholdSizeFieldProps) => {
  const { listing, householdSize, validate, register, error } = props

  return (
    <>
      {listing && validate && (
        <>
          <span className="hidden">
            <input
              className="invisible"
              type="number"
              id="householdSize"
              name="householdSize"
              defaultValue={householdSize}
              ref={register({
                min: {
                  value: listing.householdSizeMin,
                  message: t("application.form.errors.householdTooSmall"),
                },
                max: {
                  value: listing.householdSizeMax,
                  message: t("application.form.errors.householdTooBig"),
                },
              })}
            />
          </span>
          <ErrorMessage error={error}>
            <p className="text-sm font-semibold">{t("application.household.dontQualifyHeader")}</p>
            <p className="text-sm">{error?.message}</p>
            <p className="text-sm mb-8">{t("application.household.dontQualifyInfo")}</p>
          </ErrorMessage>
        </>
      )}
    </>
  )
}

export { HouseholdSizeField as default, HouseholdSizeField }
