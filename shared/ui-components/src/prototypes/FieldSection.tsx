import * as React from "react"
import "./FieldSection.scss"

export interface FieldSectionProps {
  title?: string
  subtitle?: string
  className?: string
  children: React.ReactNode
}

const FieldSection = (props: FieldSectionProps) => {
  const fieldGridClasses = ["field-grid"]
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
