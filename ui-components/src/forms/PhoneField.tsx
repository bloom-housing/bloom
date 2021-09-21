import React from "react"
import { ErrorMessage } from "../notifications/ErrorMessage"
import { PhoneMask } from "./PhoneMask"
import { Controller } from "react-hook-form"

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
  control?: any
  disabled?: boolean
  required?: boolean
  mask?: (args: any) => JSX.Element
}) => {
  const labelClasses = ["label"]
  if (props.caps) labelClasses.push("field-label--caps")
  if (props.readerOnly) labelClasses.push("sr-only")
  /**
   * we need to handle two different use cases,
   * 1. supplying the render function
   * 2. allowing for "as"
   * So shared props below with two different Controller renders
   */
  const controllerProps = {
    className: "input",
    id: props.id,
    name: props.name,
    placeholder: props.placeholder,
    defaultValue: props.defaultValue || "",
    disabled: props.disabled,
    control: props.control,
    rules: {
      validate: {
        inputTel: (v: string) => {
          if (!props.required && !v?.length) return true

          const dropdown = document.querySelector<HTMLInputElement>(
            "#" + props.name.replace(".", "\\.")
          )
          if (!dropdown || dropdown.disabled) return true
          return v?.match(/\d/g)?.length == 10 ? true : false
        },
      },
    },
  }

  return (
    <div className={"field " + (props.error ? "error" : "")}>
      {props.label && <label className={labelClasses.join(" ")}>{props.label}</label>}
      <div className={props.controlClassName}>
        {props.mask ? (
          <Controller {...controllerProps} render={props.mask} />
        ) : (
          <Controller {...controllerProps} as={PhoneMask} />
        )}
        <ErrorMessage id={`${props.id}-error`} error={props.error}>
          {props.errorMessage}
        </ErrorMessage>
      </div>
    </div>
  )
}
