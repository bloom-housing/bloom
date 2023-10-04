import React, { useState, useEffect } from "react"
import dayjs from "dayjs"
import { t } from "@bloom-housing/ui-components"
import { ErrorMessage } from "../notifications/ErrorMessage"
import { Field } from "./Field"
import { Select } from "./Select"
import { UseFormMethods } from "react-hook-form"

export type TimeFieldPeriod = "am" | "pm"

export type TimeFieldValues = {
  hours: string
  minutes: string
  seconds: string
  period: TimeFieldPeriod
}

export type TimeFieldProps = {
  defaultValues?: TimeFieldValues
  disabled?: boolean
  error?: boolean
  id?: string
  label: string
  labelClass?: string
  name?: string
  readerOnly?: boolean
  register: UseFormMethods["register"]
  required?: boolean
  watch: UseFormMethods["watch"]
  seconds?: boolean
  dataTestId?: string
  strings?: {
    hour?: string
    minutes?: string
    minutesPlaceholder?: string
    seconds?: string
    time?: string
    timeError?: string
  }
}

export const formatDateToTimeField = (date: Date) => {
  const dateObj = dayjs(date)

  return {
    hours: dateObj.format("hh"),
    minutes: dateObj.format("mm"),
    seconds: dateObj.format("ss"),
    period: new Date(date).getHours() >= 12 ? "pm" : "am",
  }
}

const TimeField = ({
  required = false,
  error,
  register,
  watch,
  name,
  id,
  label,
  labelClass,
  readerOnly,
  seconds,
  defaultValues,
  disabled,
  dataTestId,
  strings,
}: TimeFieldProps) => {
  const fieldName = (baseName: string) => {
    return [name, baseName].filter((item) => item).join(".")
  }

  // it prevents partial fill, all fields should be filled or nothing
  const [innerRequiredRule, setInnerRequiredRule] = useState(false)

  const hoursField = watch(fieldName("hours"))
  const minutesField = watch(fieldName("minutes"))
  const secondsField = watch(fieldName("seconds"))

  useEffect(() => {
    const someFieldsFilled = hoursField || minutesField || secondsField
    setInnerRequiredRule(someFieldsFilled)
  }, [hoursField, minutesField, secondsField])

  const labelClasses = ["field-label", labelClass]
  if (readerOnly) labelClasses.push("sr-only")

  return (
    <fieldset id={id}>
      <legend className={labelClasses.join(" ")}>{label}</legend>
      <div className="field-group--date">
        <Field
          name={fieldName("hours")}
          label={strings?.hour ?? t("t.hour")}
          defaultValue={defaultValues?.hours ?? ""}
          readerOnly={true}
          placeholder="HH"
          error={error}
          validation={{
            required: required || innerRequiredRule,
            validate: {
              hourRange: (value: string) => {
                if (!required && !value?.length) return true

                return parseInt(value) > 0 && parseInt(value) <= 12
              },
            },
          }}
          inputProps={{ maxLength: 2 }}
          register={register}
          describedBy={`${id}-error`}
          disabled={disabled}
          dataTestId={dataTestId ? `${dataTestId}-hours` : undefined}
        />

        <Field
          name={fieldName("minutes")}
          label={strings?.minutes ?? t("t.minutes")}
          defaultValue={defaultValues?.minutes ?? ""}
          readerOnly={true}
          placeholder={strings?.minutesPlaceholder ?? t("account.settings.placeholders.month")}
          error={error}
          validation={{
            required: required || innerRequiredRule,
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
          disabled={disabled}
          dataTestId={dataTestId ? `${dataTestId}-minutes` : undefined}
        />

        {seconds && (
          <Field
            label={strings?.seconds ?? t("t.seconds")}
            defaultValue={defaultValues?.seconds ?? ""}
            name={fieldName("seconds")}
            readerOnly={true}
            placeholder="SS"
            error={error}
            validation={{
              required: required || innerRequiredRule,
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
            disabled={disabled}
            dataTestId={dataTestId ? `${dataTestId}-seconds` : undefined}
          />
        )}

        <Select
          name={fieldName("period")}
          id={fieldName("period")}
          labelClassName="sr-only"
          label={strings?.time ?? t("t.time")}
          register={register}
          options={["am", "pm"]}
          keyPrefix="t"
          defaultValue={defaultValues?.period || ""}
          error={error}
          describedBy={`${id}-error`}
          disabled={disabled}
          dataTestId={dataTestId ? `${dataTestId}-period` : undefined}
        />
      </div>

      <div id={`${id}-error`} className="field error">
        <ErrorMessage id={"time-field-error"} error={error}>
          {strings?.timeError ?? t("errors.timeError")}
        </ErrorMessage>
      </div>
    </fieldset>
  )
}

export { TimeField as default, TimeField }
