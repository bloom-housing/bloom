import React from "react"
import { ErrorMessage } from "./ErrorMessage"
import { FormOptions } from "../helpers/formOptions"

export const Select = ({
  error,
  errorMessage,
  controlClassName,
  id,
  name,
  label,
  defaultValue,
  placeholder,
  register,
  validation,
  disabled,
  options,
  keyPrefix,
}: Props) => {
  return (
    <div className={"field " + (error ? "error" : "")}>
      <label htmlFor={id}>{label}</label>
      <div className={controlClassName}>
        <select
          className="input"
          id={id || name}
          name={name}
          defaultValue={defaultValue}
          ref={register(validation)}
          disabled={disabled}
        >
          {placeholder && (
            <option value="" disabled selected>
              {placeholder}
            </option>
          )}
          <FormOptions options={options} keyPrefix={keyPrefix} />
        </select>
      </div>
      <ErrorMessage error={error}>{errorMessage}</ErrorMessage>
    </div>
  )
}

interface Props {
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
  options: string[]
  keyPrefix: string
}
