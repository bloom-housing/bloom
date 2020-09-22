import * as React from "react"
import Field from "../forms/Field"

export interface FieldItemProps {
  children: React.ReactNode
  className?: string
}

const FieldItem = (props: FieldItemProps) => {
  const fieldItemClasses = ["field-item"]
  if (props.className) fieldItemClasses.push(props.className)

  return (
    <div className={fieldItemClasses.join(" ")}>
      {props.children}
    </div>
  )
}

export { FieldItem as default, FieldItem }
