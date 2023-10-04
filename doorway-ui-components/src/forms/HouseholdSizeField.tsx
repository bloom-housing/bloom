import React from "react"
import { t } from "@bloom-housing/ui-components"
import { ErrorMessage } from "../notifications/ErrorMessage"
import { AlertBox } from "../notifications/AlertBox"
import { AlertNotice } from "../notifications/AlertNotice"
import { UseFormMethods, FieldError } from "react-hook-form"

export interface HouseholdSizeFieldProps {
  assistanceUrl: string
  clearErrors: () => void
  error: FieldError | null
  householdSize: number
  householdSizeMax: number
  householdSizeMin: number
  register: UseFormMethods["register"]
  validate: boolean
  strings?: {
    dontQualifyDescription?: string
    dontQualifyHeader?: string
    getAssistance?: string
    householdTooBigError?: string
    householdTooSmallError?: string
  }
}

const HouseholdSizeField = (props: HouseholdSizeFieldProps) => {
  const {
    householdSize,
    householdSizeMax,
    householdSizeMin,
    validate,
    register,
    clearErrors,
    error,
    assistanceUrl,
    strings,
  } = props
  if (!householdSizeMax || !validate) {
    return <></>
  }
  return (
    <>
      <span className="hidden" aria-hidden="true">
        <input
          className="invisible"
          type="number"
          id="householdSize"
          name="householdSize"
          defaultValue={householdSize}
          ref={
            householdSizeMax
              ? register({
                  min: {
                    value: householdSizeMin || 0,
                    message: strings?.householdTooSmallError ?? t("errors.householdTooSmall"),
                  },
                  max: {
                    value: householdSizeMax,
                    message: strings?.householdTooBigError ?? t("errors.householdTooBig"),
                  },
                })
              : register
          }
        />
      </span>
      <ErrorMessage
        id={"householdsize-error"}
        error={!!error}
        className="block mt-0 line-normal text-alert"
      >
        <AlertBox type="alert" inverted onClose={() => clearErrors()}>
          {strings?.dontQualifyHeader ?? t("application.household.dontQualifyHeader")}
        </AlertBox>
        <AlertNotice title={error?.message} type="alert" inverted>
          <p className="mb-2">
            {strings?.dontQualifyDescription ?? t("application.household.dontQualifyInfo")}
          </p>
          <p>
            <a href={assistanceUrl}>{strings?.getAssistance ?? t("pageTitle.getAssistance")}</a>
          </p>
        </AlertNotice>
      </ErrorMessage>
    </>
  )
}

export { HouseholdSizeField as default, HouseholdSizeField }
