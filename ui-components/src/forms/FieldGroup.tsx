import React from "react"
import { ErrorMessage } from "../notifications/ErrorMessage"
import { UseFormMethods } from "react-hook-form"

interface FieldSingle {
  id: string
  label: string
  value?: string
  defaultChecked?: boolean
}

interface FieldGroupProps {
  error?: boolean
  errorMessage?: string
  name: string
  type?: string
  groupLabel?: string
  fields?: FieldSingle[]
  groupNote?: string
  register: UseFormMethods["register"]
  validation?: Record<string, any>
  fieldGroupClassName?: string
  fieldClassName?: string
}

const FieldGroup = ({
  name,
  groupLabel,
  fields,
  type = "checkbox",
  validation = {},
  error,
  errorMessage,
  groupNote,
  register,
  fieldGroupClassName,
  fieldClassName,
}: FieldGroupProps) => {
  return (
    <>
      {groupLabel && <label className="field-label--caps">{groupLabel}</label>}
      {groupNote && <p className="field-note mb-4">{groupNote}</p>}

      <div className={`field ${error && "error"} ${fieldGroupClassName || ""}`}>
        {fields?.map((item) => (
          <div className={`field ${fieldClassName || ""}`} key={item.id}>
            <input
              aria-describedby={`${name}-error`}
              aria-invalid={!!error || false}
              type={type}
              id={item.id}
              defaultValue={item.value || item.id}
              name={name}
              defaultChecked={item.defaultChecked || false}
              ref={register(validation)}
            />
            <label htmlFor={item.id} className="font-semibold">
              {item.label}
            </label>
          </div>
        ))}

        {error && errorMessage && (
          <ErrorMessage id={`${name}-error`} error={error}>
            {errorMessage}
          </ErrorMessage>
        )}
      </div>
    </>
  )
}

export { FieldGroup as default, FieldGroup }
