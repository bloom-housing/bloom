import * as React from "react"
import "./Textarea.scss"
import { t } from "../helpers/translator"
import { UseFormMethods } from "react-hook-form"

type WrapOptions = "soft" | "hard"

export interface TextareaProps {
  cols?: number
  disabled?: boolean
  errorMessage?: string
  id?: string
  label: string
  maxLength?: number
  name: string
  placeholder?: string
  register: UseFormMethods["register"]
  resize?: boolean
  rows?: number
  wrap?: WrapOptions
}

export const Textarea = (props: TextareaProps) => {
  const textareaClassnames = ["textarea"]
  if (props.disabled) textareaClassnames.push("textarea-disabled")
  if (props.errorMessage) textareaClassnames.push("textarea-error")
  if (props.resize === false) textareaClassnames.push("textarea-resize-off")
  const labelClassnames = ["textarea-label"]
  if (props.errorMessage) labelClassnames.push("textarea-label-error")

  return (
    <>
      <label className={labelClassnames.join(" ")} htmlFor={props.id ?? props.name}>
        {props.label}
      </label>
      <textarea
        className={textareaClassnames.join(" ")}
        cols={props.cols ?? 40}
        disabled={props.disabled}
        id={props.id ?? props.name}
        maxLength={props.maxLength ?? 150}
        name={props.name}
        placeholder={props.placeholder ?? t("t.description")}
        ref={props.register}
        rows={props.rows ?? 4}
        wrap={props.wrap ?? "soft"}
      />
      {props.errorMessage && <span className="textarea-error-message">{props.errorMessage}</span>}
    </>
  )
}
