import React from "react"
import { ErrorMessage } from "../notifications/ErrorMessage"
import t from "../helpers/translator"
import Field from "./Field"
import { HouseholdMember } from "@bloom-housing/core"
import moment from "moment"

export interface DOBFieldProps {
  error?: any
  label: string
  register: any // comes from React Hook Form
  watch: any // comes from React Hook Form
  applicant: HouseholdMember
  atAge?: boolean
  name?: string
}

const DOBField = (props: DOBFieldProps) => {
  const { applicant, error, register, watch, atAge, name } = props
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
    <fieldset>
      <legend className="field-label--caps">{props.label}</legend>

      <div className="field-group--dob">
        <Field
          name={fieldName("birthMonth")}
          label={t("t.month")}
          readerOnly={true}
          placeholder="MM"
          defaultValue={"" + (applicant.birthMonth > 0 ? applicant.birthMonth : "")}
          error={error?.birthMonth}
          validation={{
            required: true,
            validate: {
              monthRange: (value: string) => parseInt(value) > 0 && parseInt(value) <= 12,
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
          defaultValue={"" + (applicant.birthDay > 0 ? applicant.birthDay : "")}
          error={error?.birthDay}
          validation={{
            required: true,
            validate: {
              dayRange: (value: string) => parseInt(value) > 0 && parseInt(value) <= 31,
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
          defaultValue={"" + (applicant.birthYear > 0 ? applicant.birthYear : "")}
          error={error?.birthYear}
          validation={{
            required: true,
            validate: {
              yearRange: (value: string) => validateAge(value),
            },
          }}
          inputProps={{ maxLength: 4 }}
          register={register}
        />
      </div>

      {(error?.birthMonth || error?.birthDay || error?.birthYear) && (
        <div className="field error">
          <span className="error-message">{t("application.name.dateOfBirthError")}</span>
        </div>
      )}
    </fieldset>
  )
}

export { DOBField as default, DOBField }
