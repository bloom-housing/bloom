import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import { AlertNotice } from "./AlertNotice"

export default {
  title: "Alerts|AlertNotice",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const AlertNoticeAlert = () => (
  <AlertNotice title={"Your household income is too low."}>
    <p className="mb-2">
      Please edit your income if you believe you might have made a mistake. Be aware that if you
      falsify any information on your application you will be disqualified.
    </p>
    <p>
      If the information you entered is accurate, we encourage you to check back in the future of as
      more properties become available.
    </p>
  </AlertNotice>
)

export const AlertNoticeAlertInverted = () => (
  <AlertNotice title={"Your household income is too low."} inverted>
    <p className="mb-2">
      Please edit your income if you believe you might have made a mistake. Be aware that if you
      falsify any information on your application you will be disqualified.
    </p>
    <p>
      If the information you entered is accurate, we encourage you to check back in the future of as
      more properties become available.
    </p>
  </AlertNotice>
)

export const AlertNoticeNotice = () => (
  <AlertNotice title={"Your household income is too low."} type="notice">
    <p className="mb-2">
      Please edit your income if you believe you might have made a mistake. Be aware that if you
      falsify any information on your application you will be disqualified.
    </p>
    <p>
      If the information you entered is accurate, we encourage you to check back in the future of as
      more properties become available.
    </p>
  </AlertNotice>
)

export const AlertNoticeNoticeInverted = () => (
  <AlertNotice title={"Your household income is too low."} type="notice" inverted>
    <p className="mb-2">
      Please edit your income if you believe you might have made a mistake. Be aware that if you
      falsify any information on your application you will be disqualified.
    </p>
    <p>
      If the information you entered is accurate, we encourage you to check back in the future of as
      more properties become available.
    </p>
  </AlertNotice>
)

export const AlertNoticeSuccess = () => (
  <AlertNotice title={"Your household income is too low."} type="success">
    <p className="mb-2">
      Please edit your income if you believe you might have made a mistake. Be aware that if you
      falsify any information on your application you will be disqualified.
    </p>
    <p>
      If the information you entered is accurate, we encourage you to check back in the future of as
      more properties become available.
    </p>
  </AlertNotice>
)

export const AlertNoticeSuccessInverted = () => (
  <AlertNotice title={"Your household income is too low."} type="success" inverted>
    <p className="mb-2">
      Please edit your income if you believe you might have made a mistake. Be aware that if you
      falsify any information on your application you will be disqualified.
    </p>
    <p>
      If the information you entered is accurate, we encourage you to check back in the future of as
      more properties become available.
    </p>
  </AlertNotice>
)
