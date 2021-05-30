import React, { useState } from "react"
import type { ReactNode } from "react"
import { Icon, IconTypes, IconFillColors } from "../icons/Icon"
import type { AlertTypes } from "./alertTypes"
import { colorClasses } from "./alertTypes"
import "./AlertBox.scss"

export interface AlertBoxProps {
  type?: AlertTypes
  closeable?: boolean
  onClose?: () => void
  children: ReactNode
  inverted?: boolean
  className?: string
  boundToLayoutWidth?: boolean
  narrow?: boolean
}

const icons: { [k in AlertTypes]: IconTypes } = {
  alert: "warning",
  notice: "info",
  success: "check",
}

const AlertBox = (props: AlertBoxProps) => {
  const [showing, setShowing] = useState(true)
  let { onClose, closeable } = props

  const classNames = [
    "alert-box",
    colorClasses[props.type || "alert"],
    ...(props.inverted ? ["invert"] : []),
    ...(props.className ? [props.className] : []),
    ...(props.boundToLayoutWidth ? [] : ["fullWidth"]),
    ...(props.narrow ? ["narrow"] : []),
  ].join(" ")

  if (onClose) closeable = true

  if (!onClose && closeable) {
    onClose = () => {
      setShowing(false)
    }
  }

  let innerSection = (
    <>
      <span className="alert-box__icon">
        <Icon
          size="medium"
          symbol={icons[props.type || "alert"]}
          fill={props.inverted ? IconFillColors.white : undefined}
        />
      </span>
      <span className="alert-box__body">
        {typeof props.children === "string" ? <p>{props.children}</p> : props.children}
      </span>
      {closeable && (
        <button
          className={`alert-box__close ${props.inverted ? "text-white" : ""}`}
          onClick={onClose}
        >
          &times;
        </button>
      )}
    </>
  )
  if (props.boundToLayoutWidth) {
    innerSection = <div className="alert-box_inner">{innerSection}</div>
  }

  return showing ? (
    <div className={classNames} role="alert">
      {innerSection}
    </div>
  ) : null
}

export { AlertBox as default, AlertBox }
