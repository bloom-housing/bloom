import React from "react"
import { t } from "../helpers/translator"
import { Field } from "./Field"
import moment from "moment"
import { UseFormMethods, FieldError, DeepMap } from "react-hook-form"

export type DateFieldValues = {
  day: string
  month: string
  year: string
}

export interface DateFieldProps {
  error?: DeepMap<DateFieldValues, FieldError>
  errorMessage?: string
  label: React.ReactNode
  register: UseFormMethods["register"]
  watch: UseFormMethods["watch"]
  defaultDate?: DateFieldValues
  name?: string
  id?: string
  required?: boolean
  disabled?: boolean
  readerOnly?: boolean
  note?: string
}

const DateField = (props: DateFieldProps) => {
  const { defaultDate, error, register, name, id, errorMessage } = props

  const getFieldName = (baseName: string) => {
    // Append overall date field name to individual date field name
    return [name, baseName].filter((item) => item).join(".")
  }

  const labelClasses = ["field-label--caps"]
  if (props.readerOnly) labelClasses.push("sr-only")

  return (
    <fieldset id={id}>
      <legend className={labelClasses.join(" ")}>{props.label}</legend>
      <div className="field-group--date">
        <Field
          name={getFieldName("month")}
          label={t("t.month")}
          disabled={props.disabled}
          readerOnly={true}
          placeholder="MM"
          defaultValue={defaultDate?.month ?? ""}
          error={error?.month !== undefined}
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
          name={getFieldName("day")}
          label={t("t.day")}
          disabled={props.disabled}
          readerOnly={true}
          placeholder="DD"
          defaultValue={defaultDate?.day ?? ""}
          error={error?.day !== undefined}
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
          name={getFieldName("year")}
          label={t("t.year")}
          disabled={props.disabled}
          readerOnly={true}
          placeholder="YYYY"
          defaultValue={defaultDate?.year ?? ""}
          error={error?.year !== undefined}
          validation={{
            required: props.required,
            validate: {
              yearRange: (value: string) => {
                if (props.required && value && parseInt(value) < 1900) return false
                if (props.required && value && parseInt(value) > moment().year() + 10) return false
                if (!props.required && !value?.length) return true
                return true
              },
            },
          }}
          inputProps={{ maxLength: 4 }}
          register={register}
        />
      </div>
      {props.note && <p className="field-note mb-2 mt-4">{props.note}</p>}

      {(error?.month || error?.day || error?.year) && (
        <div className="field error">
          <span id={`${id}-error`} className="error-message">
            {errorMessage ? errorMessage : t("errors.dateError")}
          </span>
        </div>
      )}
    </fieldset>
  )
}

export { DateField as default, DateField }
