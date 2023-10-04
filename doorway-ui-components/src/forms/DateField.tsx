import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Field } from "./Field"
import dayjs from "dayjs"
import { UseFormMethods, FieldError, DeepMap } from "react-hook-form"

export type DateFieldValues = {
  day: string
  month: string
  year: string
}

export interface DateFieldProps {
  defaultDate?: DateFieldValues
  disabled?: boolean
  error?: DeepMap<DateFieldValues, FieldError>
  errorMessage?: string
  id?: string
  label: React.ReactNode
  labelClass?: string
  name?: string
  note?: string
  readerOnly?: boolean
  register: UseFormMethods["register"]
  required?: boolean
  watch: UseFormMethods["watch"]
  dataTestId?: string
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

const DateField = (props: DateFieldProps) => {
  const { defaultDate, error, register, name, id, errorMessage } = props

  const getFieldName = (baseName: string) => {
    // Append overall date field name to individual date field name
    return [name, baseName].filter((item) => item).join(".")
  }

  const labelClasses = ["field-label", props.labelClass]
  if (props.readerOnly) labelClasses.push("sr-only")

  return (
    <fieldset id={id}>
      <legend className={labelClasses.join(" ")}>{props.label}</legend>
      <div className="field-group--date">
        <Field
          name={getFieldName("month")}
          label={props.strings?.month ?? t("t.month")}
          disabled={props.disabled}
          readerOnly={true}
          placeholder={props.strings?.monthPlaceholder ?? t("account.settings.placeholders.month")}
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
          dataTestId={props.dataTestId ? `${props.dataTestId}-month` : undefined}
        />
        <Field
          name={getFieldName("day")}
          label={props.strings?.day ?? t("t.day")}
          disabled={props.disabled}
          readerOnly={true}
          placeholder={props.strings?.dayPlaceholder ?? t("account.settings.placeholders.day")}
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
          dataTestId={props.dataTestId ? `${props.dataTestId}-day` : undefined}
        />
        <Field
          name={getFieldName("year")}
          label={props.strings?.year ?? t("t.year")}
          disabled={props.disabled}
          readerOnly={true}
          placeholder={props.strings?.yearPlaceholder ?? t("account.settings.placeholders.year")}
          defaultValue={defaultDate?.year ?? ""}
          error={error?.year !== undefined}
          validation={{
            required: props.required,
            validate: {
              yearRange: (value: string) => {
                if (props.required && value && parseInt(value) < 1900) return false
                if (props.required && value && parseInt(value) > dayjs().year() + 10) return false
                if (!props.required && !value?.length) return true
                return true
              },
            },
          }}
          inputProps={{ maxLength: 4 }}
          register={register}
          dataTestId={props.dataTestId ? `${props.dataTestId}-year` : undefined}
        />
      </div>
      {props.note && <p className="field-note mb-2 mt-4">{props.note}</p>}

      {(error?.month || error?.day || error?.year) && (
        <div className="field error">
          <span id={`${id}-error`} className="error-message">
            {errorMessage ? errorMessage : props.strings?.dateError ?? t("errors.dateError")}
          </span>
        </div>
      )}
    </fieldset>
  )
}

export { DateField as default, DateField }
