import React from "react"
import { ErrorMessage } from "./ErrorMessage"
import { FormOptions } from "../helpers/formOptions"

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
  register: any // comes from React Hook Form
  validation?: Record<string, any>
  disabled?: boolean
  options: string[]
  keyPrefix: string
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
  disabled = false,
  options,
  keyPrefix,
}: SelectProps) => {
  const idOrName = id || name

  return (
    <div className={"field " + (error ? "error" : "")}>
      <label className={labelClassName} htmlFor={id}>
        {label}
      </label>
      <div className={controlClassName}>
        <select
          aria-describedby={`${idOrName}-error`}
          aria-invalid={!!error || false}
          className="input"
          id={idOrName}
          name={name}
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
        <ErrorMessage id={`${idOrName}-error`} error={error}>
          {errorMessage}
        </ErrorMessage>
      )}
    </div>
  )
}
