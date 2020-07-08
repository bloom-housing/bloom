import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import SVG from "react-inlinesvg"
import AlertBox from "./AlertBox"

export default {
  title: "Alerts|AlertBox",
  decorators: [
    withA11y,
    (storyFn: any) => (
      <div style={{ padding: "1rem" }}>
        {storyFn()}
        <SVG src="/images/icons.svg" />
      </div>
    ),
  ],
}

const noop = () => {
  // intentionally blank
}

export const AlertBoxAlert = () => (
  <AlertBox onClose={noop} type="alert">
    Some warning
  </AlertBox>
)

export const AlertBoxAlertInvert = () => (
  <AlertBox onClose={noop} type="alert" inverted>
    Some warning
  </AlertBox>
)

export const AlertBoxNotice = () => (
  <AlertBox onClose={noop} type="notice">
    Some warning
  </AlertBox>
)

export const AlertBoxNoticeInvert = () => (
  <AlertBox onClose={noop} type="notice" inverted>
    Some warning
  </AlertBox>
)

export const AlertBoxSuccess = () => (
  <AlertBox onClose={noop} type="success">
    Some warning
  </AlertBox>
)

export const AlertBoxSuccessInvert = () => (
  <AlertBox onClose={noop} type="success" inverted>
    Some warning
  </AlertBox>
)
