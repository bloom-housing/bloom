import React from "react"
import { Listing } from "@bloom-housing/backend-core/types"
import { t } from "../helpers/translator"
import { ErrorMessage } from "../notifications/ErrorMessage"
import { AlertBox, AlertNotice } from "../notifications"
import { UseFormMethods } from "react-hook-form"

export interface HouseholdSizeFieldProps {
  listing: Listing
  householdSize: number
  validate: boolean
  register: UseFormMethods["register"]
  error: any
  clearErrors: () => void
  assistanceUrl: string
}

const HouseholdSizeField = (props: HouseholdSizeFieldProps) => {
  const { listing, householdSize, validate, register, clearErrors, error, assistanceUrl } = props

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
                  value: listing.property.householdSizeMin,
                  message: t("errors.householdTooSmall"),
                },
                max: {
                  value: listing.property.householdSizeMax,
                  message: t("errors.householdTooBig"),
                },
              })}
            />
          </span>
          <ErrorMessage id={"householdsize-error"} error={error}>
            <AlertBox type="alert" inverted onClose={() => clearErrors()}>
              {t("application.household.dontQualifyHeader")}
            </AlertBox>
            <AlertNotice title={error?.message} type="alert" inverted>
              <p className="mb-2">{t("application.household.dontQualifyInfo")}</p>
              <p>
                <a href={assistanceUrl}>{t("nav.getAssistance")}</a>
              </p>
            </AlertNotice>
          </ErrorMessage>
        </>
      )}
    </>
  )
}

export { HouseholdSizeField as default, HouseholdSizeField }
