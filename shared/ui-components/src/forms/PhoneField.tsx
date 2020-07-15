import React from "react"
import { ErrorMessage } from "./ErrorMessage"
import { PhoneMask } from "./PhoneMask"
import { Controller } from "react-hook-form"

export const PhoneField = (props: {
  error?: boolean
  errorMessage?: string
  controlClassName?: string
  name: string
  label?: string
  defaultValue?: string
  control: any
  disabled?: boolean
}) => {
  return (
    <div className={"field " + (props.error ? "error" : "")}>
      <div className={props.controlClassName}>
        <Controller
          className="input"
          name={props.name}
          defaultValue={props.defaultValue}
          disabled={props.disabled}
          as={PhoneMask}
          control={props.control}
          rules={{
            validate: {
              inputTel: (v) => {
                const dropdown = document.querySelector<HTMLInputElement>(
                  "#" + props.name.replace(".", "\\.")
                )
                if (!dropdown || dropdown.disabled) return true
                return v?.match(/\d/g)?.length == 10 ? true : false
              },
            },
          }}
        />
        <ErrorMessage error={props.error}>{props.errorMessage}</ErrorMessage>
      </div>
    </div>
  )
}
