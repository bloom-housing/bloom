import React from "react"
import { AlertBox } from "./AlertBox"
import AlertBoxDocumentation from "./AlertBox.docs.mdx"
import { BADGES } from "../../.storybook/constants"
import { withMenuLinks } from "../headers/SiteHeader.stories"

export default {
  title: "Notifications/Alert Box  🚩",
  id: "notifications/alert-box",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  component: AlertBox,
  parameters: {
    docs: {
      page: AlertBoxDocumentation,
    },
    badges: [BADGES.GEN2],
  },
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

export const AlertBoxNoticeInvertLink = () => (
  <AlertBox onClose={() => {}} type="notice" inverted>
    Some warning <a href={""}>with link text</a>
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

export const AlertBoxWarn = () => (
  <AlertBox onClose={() => {}} type="warn">
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

export const AlertBoxSticky = () => (
  <div style={{ height: "200rem", border: "3px solid gray" }}>
    <div>{withMenuLinks()}</div>
    <AlertBox onClose={() => {}} type="success" sticky={true}>
      Some warning
    </AlertBox>
    <div style={{ borderTop: "1px solid gray", padding: "5rem" }}>Page Content</div>
  </div>
)

export const styleOverrides = () => {
  const cssVarsOverride = `
    .alert-box-overrides .alert-box {
      --background-color: var(--bloom-color-gray-400);
      --horizontal-padding: var(--bloom-s3);
      --font-weight: 400;
      --close-icon-color: var(--bloom-color-gray-600);
    }
  `

  return (
    <>
      <div className="alert-box-overrides">
        <AlertBox onClose={() => {}}>Some warning</AlertBox>
        <style>{cssVarsOverride}</style>
      </div>

      <p className="mt-12 font-semibold">Customized using the following variable overrides:</p>

      <pre>{cssVarsOverride.replace(".page-header-overrides ", "")}</pre>
    </>
  )
}
