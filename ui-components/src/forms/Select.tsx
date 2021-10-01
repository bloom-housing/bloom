import React from "react"
import { ErrorMessage } from "../notifications/ErrorMessage"
import { FormOptions } from "../helpers/formOptions"
import { UseFormMethods } from "react-hook-form"

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  error?: boolean
  errorMessage?: string
  controlClassName?: string
  labelClassName?: string
  type?: string
  id?: string
  name: string
  label?: string
  defaultValue?: string
  placeholder?: string
  register?: UseFormMethods["register"]
  validation?: Record<string, unknown>
  disabled?: boolean
  options: (string | SelectOption)[]
  keyPrefix?: string
  describedBy?: string
  inputProps?: Record<string, unknown>
}

export const Select = ({
  error,
  errorMessage,
  controlClassName,
  labelClassName,
  id,
  name,
  label,
  placeholder,
  register,
  validation,
  disabled,
  options,
  keyPrefix,
  describedBy,
  inputProps,
  defaultValue,
}: SelectProps) => {
  return (
    <div className={"field " + (error ? "error" : "")}>
      <label className={labelClassName} htmlFor={id}>
        {label}
      </label>
      <div className={controlClassName}>
        <select
          className="input"
          id={id || name}
          name={name}
          aria-describedby={describedBy ? describedBy : `${id}-error`}
          aria-invalid={!!error || false}
          ref={register && register(validation)}
          disabled={disabled}
          defaultValue={defaultValue ?? ""}
          {...inputProps}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          <FormOptions options={options} keyPrefix={keyPrefix} />
        </select>
      </div>
      {error && errorMessage && (
        <ErrorMessage id={`${id}-error`} error={error}>
          {errorMessage}
        </ErrorMessage>
      )}
    </div>
  )
}
