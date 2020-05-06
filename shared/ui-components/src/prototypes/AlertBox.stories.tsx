import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import "./AlertBox.scss"
import Icon from "../atoms/Icon"

export default {
  title: "Prototypes|AlertBox",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>]
}

export const AlertBoxAlert = () => (
  <div className="alert-box alert">
    <span className="alert-box__icon">
      <Icon size="medium" symbol="clock"  />
    </span>
    <p className="alert-box__body">
      Some warning
    </p>
    <button className="alert-box__close">&times;</button>
  </div>
)

export const AlertBoxAlertInvert = () => (
  <div className="alert-box alert invert">
    <span className="alert-box__icon">
      <Icon size="medium" symbol="clock"  />
    </span>
    <p className="alert-box__body">
      Some warning
    </p>
    <button className="alert-box__close">&times;</button>
  </div>
)

export const AlertBoxNotice = () => (
  <div className="alert-box primary">
    <span className="alert-box__icon">
      <Icon size="medium" symbol="clock"  />
    </span>
    <p className="alert-box__body">
      Some warning
    </p>
    <button className="alert-box__close">&times;</button>
  </div>
)

export const AlertBoxNoticeInvert = () => (
  <div className="alert-box primary invert">
    <span className="alert-box__icon">
      <Icon size="medium" symbol="clock"  />
    </span>
    <p className="alert-box__body">
      Some warning
    </p>
    <button className="alert-box__close">&times;</button>
  </div>
)

export const AlertBoxSucucess = () => (
  <div className="alert-box success">
    <span className="alert-box__icon">
      <Icon size="medium" symbol="clock"  />
    </span>
    <p className="alert-box__body">
      Some warning
    </p>
    <button className="alert-box__close">&times;</button>
  </div>
)

export const AlertBoxSucucessInvert = () => (
  <div className="alert-box success invert">
    <span className="alert-box__icon">
      <Icon size="medium" symbol="clock"  />
    </span>
    <p className="alert-box__body">
      Some warning
    </p>
    <button className="alert-box__close">&times;</button>
  </div>
)