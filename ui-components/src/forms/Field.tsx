import React, { useMemo } from "react"
import { ErrorMessage } from "../notifications/ErrorMessage"

export interface FieldProps {
  error?: boolean
  errorMessage?: string
  className?: string
  controlClassName?: string
  caps?: boolean
  primary?: boolean
  readerOnly?: boolean
  type?: string
  id?: string
  name: string
  note?: string
  label?: string
  defaultValue?: string | number
  onDrop?: (e: any) => boolean
  onPaste?: (e: any) => boolean
  placeholder?: string
  register: any // comes from React Hook Form
  validation?: Record<string, any>
  disabled?: boolean
  prepend?: string
  inputProps?: Record<string, unknown>
  describedBy?: string
}

const Field = (props: FieldProps) => {
  const classes = ["field"]
  if (props.error) {
    classes.push("error")
  }

  if (props.className) {
    classes.push(props.className)
  }

  const controlClasses = ["control"]
  if (props.controlClassName) {
    controlClasses.push(props.controlClassName)
  }

  const type = props.type || "text"
  const isRadioOrCheckbox = ["radio", "checkbox"].includes(type)

  const label = useMemo(() => {
    const labelClasses = ["label"]
    if (props.caps) labelClasses.push("field-label--caps")
    if (props.primary) labelClasses.push("text-primary")
    if (props.readerOnly) labelClasses.push("sr-only")

    return (
      <label className={labelClasses.join(" ")} htmlFor={props.id || props.name}>
        {props.label}
      </label>
    )
  }, [props.caps, props.primary, props.readerOnly, props.id, props.name, props.label])

  const idOrName = props.id || props.name

  let note = <></>
  if (props.note) {
    note = <p className="field-note mb-4">{props.note}</p>
  }

  return (
    <div className={classes.join(" ")}>
      {!isRadioOrCheckbox && label}
      {note}
      <div className={controlClasses.join(" ")}>
        {props.prepend && <span className="prepend">{props.prepend}</span>}
        <input
          aria-describedby={props.describedBy ? props.describedBy : `${idOrName}-error`}
          aria-invalid={!!props.error || false}
          className="input"
          type={type}
          id={idOrName}
          name={props.name}
          defaultValue={props.defaultValue}
          placeholder={props.placeholder}
          ref={props.register(props.validation)}
          disabled={props.disabled}
          onPaste={props.onPaste}
          onDrop={props.onDrop}
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
