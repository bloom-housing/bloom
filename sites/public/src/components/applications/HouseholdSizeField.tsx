import React from "react"
import { t, ErrorMessage, AlertBox, AlertNotice } from "@bloom-housing/ui-components"
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
                    message: t("errors.householdTooSmall"),
                  },
                  max: {
                    value: householdSizeMax,
                    message: t("errors.householdTooBig"),
                  },
                })
              : register
          }
        />
      </span>
      <ErrorMessage id={"householdsize-error"} error={!!error}>
        <AlertBox type="alert" inverted onClose={() => clearErrors()}>
          {t("application.household.dontQualifyHeader")}
        </AlertBox>
        <AlertNotice title={error?.message} type="alert" inverted>
          <p className="mb-2">{t("application.household.dontQualifyInfo")}</p>
          <p>
            <a href={assistanceUrl}>{t("pageTitle.getAssistance")}</a>
          </p>
        </AlertNotice>
      </ErrorMessage>
    </>
  )
}

export { HouseholdSizeField as default, HouseholdSizeField }
