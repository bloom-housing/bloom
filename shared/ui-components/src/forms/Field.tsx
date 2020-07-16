import React from "react"
import { ErrorMessage } from "./ErrorMessage"

export interface FieldProps {
  error?: boolean
  errorMessage?: string
  controlClassName?: string
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
  const controlClasses = ["control"]
  if (props.controlClassName) {
    controlClasses.push(props.controlClassName)
  }

  return (
    <div className={classes.join(" ")}>
      {props.label && <label htmlFor={props.name}>{props.label}</label>}
      <div className={controlClasses.join(" ")}>
        {props.prepend && <span className="prepend">{props.prepend}</span>}
        <input
          className="input"
          type={props.type || "text"}
          id={props.id || props.name}
          name={props.name}
          defaultValue={props.defaultValue}
          placeholder={props.placeholder}
          ref={props.register(props.validation)}
          disabled={props.disabled}
          {...props.inputProps}
        />
      </div>
      <ErrorMessage error={props.error}>{props.errorMessage}</ErrorMessage>
    </div>
  )
}

export { Field as default, Field }
