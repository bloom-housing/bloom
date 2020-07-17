import React from "react"
import { Listing } from "@bloom-housing/core"
import { t } from "../helpers/translator"
import ErrorMessage from "./ErrorMessage"
import { AlertBox, AlertNotice } from "../alerts"

export interface HouseholdSizeFieldProps {
  listing: Listing
  householdSize: number
  validate: boolean
  register: any
  error: any
  clearError: () => void
  assistanceUrl: string
}

const HouseholdSizeField = (props: HouseholdSizeFieldProps) => {
  const { listing, householdSize, validate, register, clearError, error, assistanceUrl } = props

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
            <AlertBox type="alert" inverted onClose={() => clearError()}>
              {t("application.household.dontQualifyHeader")}
            </AlertBox>
            <AlertNotice title={error?.message} type="alert" inverted>
              <p className="mb-2">{t("application.household.dontQualifyInfo")}</p>
              <p>
                <a href={assistanceUrl}>
                  {t("application.financial.income.validationError.assistance")}
                </a>
              </p>
            </AlertNotice>
          </ErrorMessage>
        </>
      )}
    </>
  )
}

export { HouseholdSizeField as default, HouseholdSizeField }
