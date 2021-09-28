import * as React from "react"
import { t } from "../../../helpers/translator"

const OrDivider = (props: { bgColor: string }) => (
  <div className="aside-block__divider">
    <span className={`bg-${props.bgColor} aside-block__conjunction`}>{t("t.or")}</span>
  </div>
)

export { OrDivider as default, OrDivider }
