import React from "react"
import { t } from "../helpers/translator"
import { Field } from "./Field"
import { HouseholdMemberUpdate } from "@bloom-housing/core"
import moment from "moment"

export interface DOBFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: any // comes from React Hook Form
  applicant: HouseholdMemberUpdate
  atAge?: boolean
  name?: string
  id?: string
  required?: boolean
}

const DOBField = (props: DOBFieldProps) => {
  const { applicant, error, register, watch, atAge, name, id } = props
  const fieldName = (baseName: string) => {
    return [name, baseName].filter((item) => item).join(".")
  }
  const birthDay = watch(fieldName("birthDay"))
  const birthMonth = watch(fieldName("birthMonth"))
  const validateAge = (value: string) => {
    return (
      parseInt(value) > 1900 &&
      moment(`${birthMonth}/${birthDay}/${value}`, "MM/DD/YYYY") <
        moment().subtract(atAge ? 18 : 0, "years")
    )
  }

  return (
    <fieldset id={id}>
      <legend className="field-label--caps">{props.label}</legend>

      <div className="field-group--dob">
        <Field
          name={fieldName("birthMonth")}
          label={t("t.month")}
          readerOnly={true}
          placeholder="MM"
          defaultValue={applicant.birthMonth ? applicant.birthMonth : ""}
          error={error?.birthMonth}
          validation={{
            required: props.required,
            validate: {
              monthRange: (value: string) => {
                if (!props.required && !value?.length) return true

                return parseInt(value) > 0 && parseInt(value) <= 12
              },
            },
          }}
          inputProps={{ maxLength: 2 }}
          register={register}
        />
        <Field
          name={fieldName("birthDay")}
          label={t("t.day")}
          readerOnly={true}
          placeholder="DD"
          defaultValue={applicant.birthDay ? applicant.birthDay : ""}
          error={error?.birthDay}
          validation={{
            required: props.required,
            validate: {
              dayRange: (value: string) => {
                if (!props.required && !value?.length) return true

                return parseInt(value) > 0 && parseInt(value) <= 31
              },
            },
          }}
          inputProps={{ maxLength: 2 }}
          register={register}
        />
        <Field
          name={fieldName("birthYear")}
          label={t("t.year")}
          readerOnly={true}
          placeholder="YYYY"
          defaultValue={applicant.birthYear ? applicant.birthYear : ""}
          error={error?.birthYear}
          validation={{
            required: props.required,
            validate: {
              yearRange: (value: string) => {
                if (!props.required && !value?.length) return true

                return validateAge(value)
              },
            },
          }}
          inputProps={{ maxLength: 4 }}
          register={register}
        />
      </div>

      {(error?.birthMonth || error?.birthDay || error?.birthYear) && (
        <div className="field error">
          <span id={`${id}-error`} className="error-message">
            {t("application.name.dateOfBirthError")}
          </span>
        </div>
      )}
    </fieldset>
  )
}

export { DOBField as default, DOBField }
