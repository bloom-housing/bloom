import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import "./AlertNotice.scss"
//import Icon from "../atoms/Icon"

export default {
  title: "Prototypes|AlertNotice",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const AlertNotice = () => (
  <div className="alert-notice alert">
    <p className="text-alert mb-2">Your household income is too low.</p>
    <p className="text-sm mb-2">
      Please edit your income if you believe you might have made a mistake. Be aware that if you
      falsify any information on your application you will be disqualified.
    </p>
    <p className="text-sm">
      If the information you entered is accurate, we encourage you to check back in the future of as
      more properties become available.
    </p>
  </div>
)
