import * as React from "react"
import "./FormCard.scss"

export interface FormCardProps {
  header?: React.ReactNode
  children: React.ReactNode
  className?: string
}

const FormCard = (props: FormCardProps) => {
  const classNames = `form-card ${props.className || ""}`
  if (props.header) {
    return (
      <article className={classNames}>
        <div className="form-card__header">
          <header className="form-card__header_group form-card__header_title">
            {props.header}
          </header>

          <div className="form-card__header_nav">{props.children}</div>
        </div>
      </article>
    )
  }

  return <article className={classNames}>{props.children}</article>
}

export { FormCard as default, FormCard }
