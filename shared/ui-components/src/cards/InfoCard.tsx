import * as React from "react"
import "./InfoCard.scss"
import Markdown from "markdown-to-jsx"

export interface InfoCardProps {
  title: string
  externalHref?: string
  className?: string
  children: JSX.Element | string
}

const InfoCard = (props: InfoCardProps) => {
  const wrapperClasses = ["info-card"]
  if (props.className) {
    wrapperClasses.push(props.className)
  }

  return (
    <div className={wrapperClasses.join(" ")}>
      {props.externalHref ? (
        <h4 className="info-card__title">
          <a href={props.externalHref} target="_blank">
            {props.title}
          </a>
        </h4>
      ) : (
        <h4 className="info-card__title">{props.title}</h4>
      )}
      {typeof props.children == "string" ? (
        <div className="markdown">
          <Markdown options={{ disableParsingRawHTML: true }} children={props.children} />
        </div>
      ) : (
        props.children
      )}
    </div>
  )
}

export { InfoCard as default, InfoCard }
