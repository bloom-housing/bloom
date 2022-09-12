import React from "react"
import { t } from "../helpers/translator"
import { Field } from "./Field"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)
import { UseFormMethods, FieldError, DeepMap } from "react-hook-form"

export type DOBFieldValues = {
  birthDay: string
  birthMonth: string
  birthYear: string
}

export interface DOBFieldProps {
  error?: DeepMap<DOBFieldValues, FieldError>
  errorMessage?: string
  label: React.ReactNode
  register: UseFormMethods["register"]
  watch: UseFormMethods["watch"]
  defaultDOB?: DOBFieldValues
  validateAge18?: boolean
  name?: string
  id?: string
  required?: boolean
  disabled?: boolean
  readerOnly?: boolean
  strings?: {
    dateError?: string
    day?: string
    dayPlaceholder?: string
    month?: string
    monthPlaceholder?: string
    year?: string
    yearPlaceholder?: string
  }
}

const DOBField = (props: DOBFieldProps) => {
  const { defaultDOB, error, register, watch, validateAge18, name, id, errorMessage } = props

  const getFieldName = (baseName: string) => {
    // Append overall date field name to individual date field name
    return [name, baseName].filter((item) => item).join(".")
  }

  const birthDay = watch(getFieldName("birthDay")) ?? defaultDOB?.birthDay
  const birthMonth = watch(getFieldName("birthMonth")) ?? defaultDOB?.birthMonth

  const validateAge = (value: string) => {
    return (
      parseInt(value) > 1900 &&
      dayjs(`${birthMonth}/${birthDay}/${value}`, "M/D/YYYY") < dayjs().subtract(18, "years")
    )
  }

  const labelClasses = ["field-label--caps"]
  if (props.readerOnly) labelClasses.push("sr-only")

  return (
    <fieldset id={id}>
      <legend className={labelClasses.join(" ")}>{props.label}</legend>

      <div className="field-group--date">
        <Field
          name={getFieldName("birthMonth")}
          label={props.strings?.month ?? t("t.month")}
          disabled={props.disabled}
          readerOnly={true}
          placeholder={props.strings?.monthPlaceholder ?? t("account.settings.placeholders.month")}
          defaultValue={defaultDOB?.birthMonth ? defaultDOB.birthMonth : ""}
          error={error?.birthMonth !== undefined}
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
          dataTestId={"dob-field-month"}
        />
        <Field
          name={getFieldName("birthDay")}
          label={props.strings?.day ?? t("t.day")}
          disabled={props.disabled}
          readerOnly={true}
          placeholder={props.strings?.dayPlaceholder ?? t("account.settings.placeholders.day")}
          defaultValue={defaultDOB?.birthDay ? defaultDOB.birthDay : ""}
          error={error?.birthDay !== undefined}
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
          dataTestId={"dob-field-day"}
        />
        <Field
          name={getFieldName("birthYear")}
          label={props.strings?.year ?? t("t.year")}
          disabled={props.disabled}
          readerOnly={true}
          placeholder={props.strings?.yearPlaceholder ?? t("account.settings.placeholders.year")}
          defaultValue={defaultDOB?.birthYear ? defaultDOB.birthYear : ""}
          error={error?.birthYear !== undefined}
          validation={{
            required: props.required,
            validate: {
              yearRange: (value: string) => {
                if (props.required && value && parseInt(value) < 1900) return false
                if (props.required && value && parseInt(value) > dayjs().year() + 10) return false
                if (!props.required && !value?.length) return true
                if (value?.length && validateAge18) return validateAge(value)
                return true
              },
            },
          }}
          inputProps={{ maxLength: 4 }}
          register={register}
          dataTestId={"dob-field-year"}
        />
      </div>

      {(error?.birthMonth || error?.birthDay || error?.birthYear) && (
        <div className="field error">
          <span id={`${id}-error`} className="error-message">
            {errorMessage ? errorMessage : props.strings?.dateError ?? t("errors.dateOfBirthError")}
          </span>
        </div>
      )}
    </fieldset>
  )
}

export { DOBField as default, DOBField }
