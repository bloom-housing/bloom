import React from "react"
import { t } from "../helpers/translator"
import { ErrorMessage } from "../notifications/ErrorMessage"
import { Field } from "./Field"
import { Select } from "../forms/Select"
import { UseFormMethods } from "react-hook-form"

type TimeFieldDefaultValues = {
  hours?: number
  minutes?: number
  seconds?: number
  time?: "am" | "pm"
}

export type TimeFieldProps = {
  error?: boolean
  register: UseFormMethods["register"]
  name?: string
  id?: string
  label: string
  required?: boolean
  readerOnly?: boolean
  defaultValues?: TimeFieldDefaultValues
}

const TimeField = ({
  required = false,
  error,
  register,
  name,
  id,
  label,
  readerOnly,
  defaultValues,
}: TimeFieldProps) => {
  const fieldName = (baseName: string) => {
    return [name, baseName].filter((item) => item).join(".")
  }

  const labelClasses = ["field-label--caps"]
  if (readerOnly) labelClasses.push("sr-only")

  return (
    <fieldset id={id}>
      <legend className={labelClasses.join(" ")}>{label}</legend>

      <div className="field-group--date">
        <Field
          name={fieldName("hours")}
          label={t("t.hour")}
          defaultValue={defaultValues?.hours || ""}
          readerOnly={true}
          placeholder="HH"
          error={error}
          validation={{
            required: required,
            validate: {
              hourRange: (value: string) => {
                if (!required && !value?.length) return true

                return parseInt(value) > 0 && parseInt(value) <= 11
              },
            },
          }}
          inputProps={{ maxLength: 2 }}
          register={register}
          describedBy={`${id}-error`}
        />

        <Field
          name={fieldName("minutes")}
          label={t("t.minutes")}
          defaultValue={defaultValues?.minutes || ""}
          readerOnly={true}
          placeholder="MM"
          error={error}
          validation={{
            required: required,
            validate: {
              minutesRange: (value: string) => {
                if (!required && !value?.length) return true

                return parseInt(value) >= 0 && parseInt(value) <= 59
              },
            },
          }}
          inputProps={{ maxLength: 2 }}
          register={register}
          describedBy={`${id}-error`}
        />

        <Field
          label={t("t.seconds")}
          defaultValue={defaultValues?.seconds || ""}
          name={fieldName("seconds")}
          readerOnly={true}
          placeholder="SS"
          error={error}
          validation={{
            required: required,
            validate: {
              secondsRange: (value: string) => {
                if (!required && !value?.length) return true

                return parseInt(value) >= 0 && parseInt(value) <= 59
              },
            },
          }}
          inputProps={{ maxLength: 2 }}
          register={register}
          describedBy={`${id}-error`}
        />

        <Select
          name={fieldName("time")}
          id={fieldName("time")}
          labelClassName="sr-only"
          label={t("t.time")}
          register={register}
          options={["am", "pm"]}
          keyPrefix="t"
          defaultValue={defaultValues?.time || ""}
          error={error}
          describedBy={`${id}-error`}
        />
      </div>

      <div id={`${id}-error`} className="field error">
        <ErrorMessage error={error}>{t("errors.timeError")}</ErrorMessage>
      </div>
    </fieldset>
  )
}

export { TimeField as default, TimeField }
