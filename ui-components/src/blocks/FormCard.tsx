import * as React from "react"
import "./FormCard.scss"

export interface FormCardProps {
  header?: string
  children: React.ReactNode
  className?: string
}

const FormCard = (props: FormCardProps) => {
  const classNames = props.className ? `${props.className} form-card` : "form-card"
  if (props.header) {
    return (
      <article className={classNames}>
        <div className="form-card__header">
          <header className="form-card__header_group">
            <h1 className="form-card__header_title">{props.header}</h1>
          </header>

          <div className="form-card__header_nav">{props.children}</div>
        </div>
      </article>
    )
  }

  return <article className={classNames}>{props.children}</article>
}

export { FormCard as default, FormCard }
