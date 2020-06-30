import * as React from "react"
import "./FormCard.scss"

export interface FormCardProps {
  header?: string
  children: JSX.Element | JSX.Element[]
}

const FormCard = (props: FormCardProps) => {
  if (props.header) {
    return (
      <article className="form-card">
        <div className="form-card__header">
          <header className="form-card__header_group">
            <h5 className="form-card__header_title">{props.header}</h5>
          </header>

          <div className="form-card__header_nav">{props.children}</div>
        </div>
      </article>
    )
  }

  return <article className="form-card">{props.children}</article>
}

export { FormCard as default, FormCard }
