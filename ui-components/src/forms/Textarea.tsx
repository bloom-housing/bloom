import * as React from "react"
import "./Textarea.scss"
import { t } from "../helpers/translator"

type WrapOptions = "soft" | "hard"

export interface TextareaProps {
  resize?: boolean
  cols?: number
  rows?: number
  wrap?: WrapOptions
  maxLength?: number
  placeholder?: string
  disabled?: boolean
  errorMessage?: string
  label: string
}

export const Textarea = (props: TextareaProps) => {
  const textareaClassnames = ["textarea"]
  if (props.resize === false) textareaClassnames.push("textarea-resize-off")
  if (props.disabled) textareaClassnames.push("textarea-disabled")
  if (props.errorMessage) textareaClassnames.push("textarea-error")
  const labelClassnames = ["textarea-label"]
  if (props.errorMessage) labelClassnames.push("textarea-label-error")

  return (
    <>
      <span className={labelClassnames.join(" ")}>{props.label}</span>
      <textarea
        className={textareaClassnames.join(" ")}
        rows={props.rows ?? 4}
        cols={props.cols ?? 40}
        wrap={props.wrap ?? "soft"}
        maxLength={props.maxLength ?? 150}
        placeholder={props.placeholder ?? t("t.description")}
      />
      {props.errorMessage && <span className="textarea-error-message">{props.errorMessage}</span>}
    </>
  )
}
