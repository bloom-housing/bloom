import React from "react"
import { ErrorMessage } from "../notifications/ErrorMessage"
import { PhoneMask } from "./PhoneMask"
import { Controller, UseFormMethods } from "react-hook-form"

export const PhoneField = (props: {
  error?: boolean
  errorMessage?: string
  controlClassName?: string
  id?: string
  name: string
  label?: string
  caps?: boolean
  readerOnly?: boolean
  placeholder?: string
  defaultValue?: string
  control: UseFormMethods["control"]
  disabled?: boolean
  required?: boolean
}) => {
  const labelClasses = ["label"]
  if (props.caps) labelClasses.push("field-label--caps")
  if (props.readerOnly) labelClasses.push("sr-only")

  return (
    <div className={"field " + (props.error ? "error" : "")}>
      {props.label && <label className={labelClasses.join(" ")}>{props.label}</label>}
      <div className={props.controlClassName}>
        <Controller
          className="input"
          id={props.id}
          name={props.name}
          placeholder={props.placeholder}
          defaultValue={props.defaultValue || ""}
          disabled={props.disabled}
          as={PhoneMask}
          control={props.control}
          rules={{
            validate: {
              inputTel: (v) => {
                if (!props.required && !v?.length) return true

                const dropdown = document.querySelector<HTMLInputElement>(
                  "#" + props.name.replace(".", "\\.")
                )
                if (!dropdown || dropdown.disabled) return true
                return v?.match(/\d/g)?.length == 10 ? true : false
              },
            },
          }}
        />
        <ErrorMessage id={`${props.id}-error`} error={props.error}>
          {props.errorMessage}
        </ErrorMessage>
      </div>
    </div>
  )
}
