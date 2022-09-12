import React, { useState } from "react"
import type { ReactNode } from "react"
import { Icon, IconTypes, IconFillColors } from "../icons/Icon"
import type { AlertTypes } from "./alertTypes"
import { colorClasses } from "./alertTypes"
import "./AlertBox.scss"

export interface AlertBoxProps {
  boundToLayoutWidth?: boolean
  children: ReactNode
  className?: string
  closeable?: boolean
  customIcon?: IconTypes
  inverted?: boolean
  narrow?: boolean
  onClose?: () => void
  stickyToHeader?: boolean
  type?: AlertTypes
}

const icons: { [k in AlertTypes]: IconTypes } = {
  alert: "warning",
  notice: "info",
  success: "check",
  warn: "warning",
}

const AlertBox = (props: AlertBoxProps) => {
  const [showing, setShowing] = useState(true)
  let { onClose, closeable } = props

  const classNames = [
    "alert-box",
    colorClasses[props.type || ""],
    ...(props.inverted ? ["invert"] : []),
    ...(props.className ? [props.className] : []),
    ...(props.boundToLayoutWidth ? [] : ["fullWidth"]),
    ...(props.narrow ? ["narrow"] : []),
    ...(props.stickyToHeader ? ["alert-box__sticky"] : []),
  ].join(" ")

  if (onClose) closeable = true

  if (!onClose && closeable) {
    onClose = () => {
      setShowing(false)
    }
  }

  let innerSection = (
    <>
      <div className="alert-box__head">
        <div className="alert-box__title">
          {(props.type || props.customIcon) && (
            <span className="alert-box__icon">
              <Icon
                size="medium"
                symbol={props.type ? icons[props.type] : props.customIcon ?? "warning"}
                fill={props.inverted ? IconFillColors.white : undefined}
                ariaHidden={true}
              />
            </span>
          )}
          <span className="alert-box__body">
            {typeof props.children === "string" ? <p>{props.children}</p> : props.children}
          </span>
        </div>

        {closeable && (
          <button
            className={`alert-box__close ${props.inverted ? "text-white" : ""}`}
            onClick={onClose}
            aria-label="close alert"
          >
            <span aria-hidden={true}>&times;</span>
          </button>
        )}
      </div>
    </>
  )
  if (props.boundToLayoutWidth) {
    innerSection = <div className="alert-box_inner">{innerSection}</div>
  }

  return showing ? (
    <div className={classNames} role="alert" data-test-id={"alert-box"}>
      {innerSection}
    </div>
  ) : null
}

export { AlertBox as default, AlertBox }
