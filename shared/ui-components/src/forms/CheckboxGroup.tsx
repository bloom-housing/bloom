import React from "react"
import { ErrorMessage } from "./ErrorMessage"

interface CheckboxSingle {
  id: string
  label: string
  defaultChecked?: boolean
  register: any
}

interface CheckboxGroupProps {
  error?: boolean
  required?: boolean
  errorMessage?: string
  name: string
  groupLabel: string
  fields: CheckboxSingle[]
}

export const CheckboxGroup = ({
  name,
  groupLabel,
  fields,
  required = false,
  error,
  errorMessage,
}: CheckboxGroupProps) => {
  return (
    <>
      <p className="field-label--caps">{groupLabel}</p>

      <div className="mt-3 field">
        {fields &&
          fields.map((item) => (
            <div className={`field ${error && "error"}`} key={item.id}>
              <input
                type="checkbox"
                id={item.id}
                value={item.id}
                name={name}
                defaultChecked={item.defaultChecked || false}
                ref={item.register({ required })}
              />
              <label htmlFor={item.id} className="font-semibold">
                {item.label}
              </label>
            </div>
          ))}
      </div>

      {error && errorMessage && <ErrorMessage error={error}>{errorMessage}</ErrorMessage>}
    </>
  )
}
