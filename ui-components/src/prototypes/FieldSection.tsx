import * as React from "react"
import "./FieldSection.scss"

export interface FieldSectionProps {
  title?: string
  className?: string
  tinted?: boolean
  insetGrid?: boolean
  children: React.ReactNode
}

const FieldSection = (props: FieldSectionProps) => {
  const fieldGridClasses = ["field-section__grid"]
  if (props.tinted) fieldGridClasses.push("is-tinted")
  if (props.insetGrid) fieldGridClasses.push("is-inset")
  if (props.className) fieldGridClasses.push(props.className)

  return (
    <div className="field-section">
      {props.title && (
        <header className="field-section__header">
          <h2 className="field-section__title">{props.title}</h2>
        </header>
      )}

      <div className={fieldGridClasses.join(" ")}>{props.children}</div>
    </div>
  )
}

export { FieldSection as default, FieldSection }
