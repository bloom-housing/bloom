import React from "react"
import { AlertBox } from "./AlertBox"

export default {
  title: "Notifications/Alert Box",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const AlertBoxAlert = () => (
  <AlertBox onClose={() => {}} type="alert">
    Some warning
  </AlertBox>
)

export const AlertBoxAlertInvert = () => (
  <AlertBox onClose={() => {}} type="alert" inverted>
    Some warning
  </AlertBox>
)

export const AlertBoxNotice = () => (
  <AlertBox onClose={() => {}} type="notice">
    Some warning
  </AlertBox>
)

export const AlertBoxNoticeInvert = () => (
  <AlertBox onClose={() => {}} type="notice" inverted>
    Some warning
  </AlertBox>
)

export const AlertBoxSuccess = () => (
  <AlertBox onClose={() => {}} type="success">
    Some warning
  </AlertBox>
)

export const AlertBoxSuccessInvert = () => (
  <AlertBox onClose={() => {}} type="success" inverted>
    Some warning
  </AlertBox>
)

export const AlertBoxBoundToLayoutWidth = () => (
  <AlertBox onClose={() => {}} type="success" boundToLayoutWidth>
    Some warning
  </AlertBox>
)

export const AlertBoxNarrow = () => (
  <AlertBox onClose={() => {}} type="success" narrow>
    Some warning
  </AlertBox>
)
