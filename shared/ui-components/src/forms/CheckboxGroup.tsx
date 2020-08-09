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
  groupNote: string
}

export const CheckboxGroup = ({
  name,
  groupLabel,
  fields,
  required = false,
  error,
  errorMessage,
  groupNote,
}: CheckboxGroupProps) => {
  return (
    <>
      {groupLabel && <label className="field-label--caps">{groupLabel}</label>}
      {groupNote && <p className="field-note mb-4">{groupNote}</p>}

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
