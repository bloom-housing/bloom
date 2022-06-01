import * as React from "react"
import "./FormCard.scss"

export interface FormCardProps {
  header?: FormCardHeader
  children: React.ReactNode
  className?: string
}

export interface FormCardHeader {
  isVisible: boolean
  title: string
}

const FormCard = (props: FormCardProps) => {
  const classNames = props.className ? `${props.className} form-card` : "form-card"
  if (props.header?.isVisible) {
    return (
      <article className={classNames}>
        <div className="form-card__header">
          <header className="form-card__header_group">
            {props.header.title && (
              <h1 className="form-card__header_title">{props.header.title}</h1>
            )}
          </header>

          <div className="form-card__header_nav">{props.children}</div>
        </div>
      </article>
    )
  }

  return <article className={classNames}>{props.children}</article>
}

export { FormCard as default, FormCard }
