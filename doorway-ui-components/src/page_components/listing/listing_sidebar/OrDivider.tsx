import * as React from "react"
import { t } from "@bloom-housing/ui-components"

const OrDivider = (props: { bgColor: string; strings?: { orString?: string } }) => (
  <div className="aside-block__divider">
    <span className={`bg-${props.bgColor} aside-block__conjunction`}>
      {props.strings?.orString ?? t("t.or")}
    </span>
  </div>
)

export { OrDivider as default, OrDivider }
