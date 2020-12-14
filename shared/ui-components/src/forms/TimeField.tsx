import React from "react"
import { ErrorMessage, Field, Select, t } from "@bloom-housing/ui-components"
import { UseFormMethods } from "react-hook-form"

export interface TimeFieldProps {
  error?: boolean
  register: UseFormMethods["register"]
  watch: UseFormMethods["watch"]
  name?: string
  id?: string
  required?: boolean
  readerOnly?: boolean
}

const TimeField = ({ required = false, error, register, watch, name, id }: TimeFieldProps) => {
  const fieldName = (baseName: string) => {
    return [name, baseName].filter((item) => item).join(".")
  }

  return (
    <fieldset>
      <legend></legend>

      <div className="field-group--date">
        <Field
          name={fieldName("hours")}
          // label={t("t.month")}
          // defaultValue={}
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
        />

        <Field
          name={fieldName("minutes")}
          // label={t("t.month")}
          // defaultValue={}
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
        />

        <Field
          // label={t("t.month")}
          // defaultValue={}
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
        />

        <Select name={fieldName("time")} register={register} options={["am", "pm"]} keyPrefix="t" />
      </div>

      <ErrorMessage error={error}>{t("errors.timeError")}</ErrorMessage>
    </fieldset>
  )
}

export { TimeField as default, TimeField }
