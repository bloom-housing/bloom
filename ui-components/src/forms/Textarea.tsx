import * as React from "react"
import "./Textarea.scss"
import { t } from "../helpers/translator"
import { UseFormMethods } from "react-hook-form"

type WrapOptions = "soft" | "hard"

export interface TextareaProps {
  cols?: number
  defaultValue?: string
  disabled?: boolean
  errorMessage?: string
  fullWidth?: boolean
  id?: string
  label: string
  maxLength?: number
  name: string
  note?: string
  placeholder?: string
  register?: UseFormMethods["register"]
  resize?: boolean
  rows?: number
  wrap?: WrapOptions
  readerOnly?: boolean
  inputProps?: Record<string, unknown>
}

export const Textarea = (props: TextareaProps) => {
  const textareaClassnames = ["textarea"]
  if (props.disabled) textareaClassnames.push("textarea-disabled")
  if (props.errorMessage) textareaClassnames.push("textarea-error")
  if (props.resize === false) textareaClassnames.push("textarea-resize-off")
  if (props.fullWidth) textareaClassnames.push("w-full")
  const labelClassnames = ["textarea-label"]
  if (props.errorMessage) labelClassnames.push("textarea-label-error")
  if (props.readerOnly) labelClassnames.push("sr-only")

  const inputProps = { ...props.inputProps }

  return (
    <div>
      <label className={labelClassnames.join(" ")} htmlFor={props.id ?? props.name}>
        {props.label}
      </label>
      <textarea
        className={textareaClassnames.join(" ")}
        cols={props.cols ?? 40}
        disabled={props.disabled}
        defaultValue={props.defaultValue}
        id={props.id ?? props.name}
        maxLength={props.maxLength ?? 1000}
        name={props.name}
        placeholder={props.placeholder ?? t("t.description")}
        ref={props.register}
        rows={props.rows ?? 4}
        wrap={props.wrap ?? "soft"}
        title={props.label}
        {...inputProps}
      />
      {props.note && <p className="field-note font-normal mb-2">{props.note}</p>}
      {props.errorMessage && <span className="textarea-error-message">{props.errorMessage}</span>}
    </div>
  )
}
