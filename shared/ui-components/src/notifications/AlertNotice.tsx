import React from "react"
import type { ReactNode } from "react"
import type { AlertTypes } from "./alertTypes"
import { colorClasses } from "./alertTypes"
import "./AlertNotice.scss"

export interface AlertNoticeProps {
  type?: AlertTypes
  inverted?: boolean
  title: ReactNode
  children: ReactNode
  className?: string
}

const AlertNotice = (props: AlertNoticeProps) => {
  const colorClass = colorClasses[props.type || "alert"]
  const classNames = [
    "alert-notice",
    colorClass,
    ...(props.className ? [props.className] : []),
    ...(props.inverted ? ["invert"] : []),
  ].join(" ")

  return (
    <div className={classNames}>
      <div className={`alert-notice__title ${colorClass}`}>
        {typeof props.title === "string" ? <p>{props.title}</p> : props.title}
      </div>

      <div className="alert-notice__body">
        {typeof props.children === "string" ? <p>{props.children}</p> : props.children}
      </div>
    </div>
  )
}

export { AlertNotice as default, AlertNotice }
