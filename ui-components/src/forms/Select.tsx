import React from "react"
import { ErrorMessage } from "../notifications/ErrorMessage"
import { FormOptions, SelectOption } from "../helpers/formOptions"
import { UseFormMethods } from "react-hook-form"

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
  register: UseFormMethods["register"]
  validation?: Record<string, any>
  disabled?: boolean
  options: (string | SelectOption)[]
  keyPrefix?: string
  describedBy?: string
}

export const Select = ({
  error,
  errorMessage,
  controlClassName,
  labelClassName,
  id,
  name,
  label,
  defaultValue = "",
  placeholder,
  register,
  validation,
  disabled,
  options,
  keyPrefix,
  describedBy,
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
          defaultValue={defaultValue}
          ref={register(validation)}
          disabled={disabled}
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
