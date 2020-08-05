import React from "react"

export const CheckboxGroup = ({ groupLabel, fields }: Props) => {
  return (
    <div>
      <p className="field-label--caps">{groupLabel}</p>

      <div className="mt-3">
        {fields &&
          fields.map((item) => (
            <div className="field" key={item.name}>
              <input
                type="checkbox"
                id={item.name}
                name={item.name}
                defaultChecked={item.defaultChecked || false}
                ref={item.register}
              />
              <label htmlFor={item.name} className="text-primary font-semibold">
                {item.label}
              </label>
            </div>
          ))}
      </div>
    </div>
  )
}

interface CheckboxSingle {
  name: string
  label: string
  defaultChecked?: boolean
  register: any
}

interface Props {
  name: string
  groupLabel: string
  fields: CheckboxSingle[]
}
