import * as React from "react"
import "./FormCard.scss"

const FormCard = (props: { children: JSX.Element[] }) => (
  <article className="form-card">{props.children}</article>
)

export { FormCard as default, FormCard }
