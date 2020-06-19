import * as React from "react"
import "./InfoCard.scss"

export interface InfoCardProps {
  title: string
  externalHref?: string
  className?: string
  children: JSX.Element
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
      {props.children}
    </div>
  )
}

export { InfoCard as default, InfoCard }
