import React from "react"
import { ErrorMessage } from "./ErrorMessage"
import { FormOptions, stateKeys } from "../helpers/formOptions"

export const StateSelect = (props: {
  error?: boolean
  errorMessage?: string
  controlClassName?: string
  type?: string
  id?: string
  name: string
  label?: string
  defaultValue?: string
  placeholder?: string
  register: any // comes from React Hook Form
  validation?: Record<string, any>
  disabled?: boolean
}) => {
  return (
    <div className={"field " + (props.error ? "error" : "")}>
      <label htmlFor={props.id}>{props.label}</label>
      <div className={props.controlClassName}>
        <select
          className="input"
          id={props.id || props.name}
          name={props.name}
          defaultValue={props.defaultValue}
          placeholder={props.placeholder}
          ref={props.register(props.validation)}
          disabled={props.disabled}
        >
          <FormOptions options={stateKeys} keyPrefix="application.form.options.states" />
        </select>
      </div>
      <ErrorMessage error={props.error}>{props.errorMessage}</ErrorMessage>
    </div>
  )
}
