import React, { useMemo } from "react"
import { ErrorMessage } from "./ErrorMessage"

export interface FieldProps {
  error?: boolean
  errorMessage?: string
  controlClassName?: string
  caps?: boolean
  primary?: boolean
  readerOnly?: boolean
  type?: string
  id?: string
  name: string
  label?: string
  defaultValue?: string | number
  placeholder?: string
  register: any // comes from React Hook Form
  validation?: Record<string, any>
  disabled?: boolean
  prepend?: string
  inputProps?: object
}

const Field = (props: FieldProps) => {
  const classes = ["field"]
  if (props.error) {
    classes.push("error")
  }

  const labelClasses = ["label"]
  if (props.caps) labelClasses.push("field-label--caps")
  if (props.primary) labelClasses.push("text-primary")
  if (props.readerOnly) labelClasses.push("sr-only")

  const controlClasses = ["control"]
  if (props.controlClassName) {
    controlClasses.push(props.controlClassName)
  }

  const type = props.type || "text"
  const isRadioOrCheckbox = ["radio", "checkbox"].includes(type)

  const label = useMemo(
    () => (
      <label className={labelClasses.join(" ")} htmlFor={props.id || props.name}>
        {props.label}
      </label>
    ),
    [props.label, props.id, props.name, labelClasses]
  )

  const idOrName = props.id || props.name

  return (
    <div className={classes.join(" ")}>
      {!isRadioOrCheckbox && label}
      <div className={controlClasses.join(" ")}>
        {props.prepend && <span className="prepend">{props.prepend}</span>}
        <input
          aria-describedby={`${idOrName}-error`}
          aria-invalid={!!props.error || false}
          className="input"
          type={type}
          id={idOrName}
          name={props.name}
          defaultValue={props.defaultValue}
          placeholder={props.placeholder}
          ref={props.register(props.validation)}
          disabled={props.disabled}
          {...props.inputProps}
        />
        {isRadioOrCheckbox && label}
      </div>
      {props.errorMessage && (
        <ErrorMessage id={`${idOrName}-error`} error={props.error}>
          {props.errorMessage}
        </ErrorMessage>
      )}
    </div>
  )
}

export { Field as default, Field }
