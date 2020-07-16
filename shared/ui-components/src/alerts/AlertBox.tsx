import React from "react"
import type { ReactNode } from "react"
import { Icon } from "../atoms/Icon"
import type { AlertTypes } from "./alertTypes"
import { colorClasses } from "./alertTypes"
import "./AlertBox.scss"

export interface AlertBoxProps {
  type?: AlertTypes
  onClose: () => void
  children: ReactNode
  inverted?: boolean
  className?: string
}

const icons: { [k in AlertTypes]: string } = {
  alert: "warning",
  notice: "info",
  success: "check",
}

const AlertBox = (props: AlertBoxProps) => {
  const classNames = [
    "alert-box",
    colorClasses[props.type || "alert"],
    ...(props.inverted ? ["invert"] : []),
    ...(props.className ? [props.className] : []),
  ].join(" ")

  return (
    <div className={classNames}>
      <span className="alert-box__icon">
        <Icon size="medium" symbol={icons[props.type || "alert"]} white={props.inverted} />
      </span>
      <span className="alert-box__body">
        {typeof props.children === "string" ? <p>{props.children}</p> : props.children}
      </span>
      <button
        className={`alert-box__close ${props.inverted ? "text-white" : ""}`}
        onClick={props.onClose}
      >
        &times;
      </button>
    </div>
  )
}

export { AlertBox as default, AlertBox }
