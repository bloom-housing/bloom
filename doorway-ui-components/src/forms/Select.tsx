import React from "react"
import { FormOptions } from "@bloom-housing/ui-components"
import { ErrorMessage } from "../notifications/ErrorMessage"
import { UseFormMethods, RegisterOptions } from "react-hook-form"

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
  subNote?: string
  defaultValue?: string
  placeholder?: string
  register?: UseFormMethods["register"]
  validation?: RegisterOptions
  disabled?: boolean
  options: (string | SelectOption)[]
  keyPrefix?: string
  describedBy?: string
  inputProps?: Record<string, unknown>
  dataTestId?: string
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
  subNote,
  dataTestId,
}: SelectProps) => {
  return (
    <div className={`field ${error ? "error" : ""}`}>
      <label className={labelClassName} htmlFor={id}>
        {label}
      </label>
      <div className={controlClassName}>
        <select
          className="input"
          id={id || name}
          name={name}
          data-testid={dataTestId}
          aria-describedby={describedBy ? describedBy : `${id || name}-error`}
          aria-invalid={!!error || false}
          aria-label={label}
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
      {subNote && <p className="field-sub-note">{subNote}</p>}
      {error && errorMessage && (
        <ErrorMessage id={`${id || name}-error`} error={error}>
          {errorMessage}
        </ErrorMessage>
      )}
    </div>
  )
}
