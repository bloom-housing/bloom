import * as React from "react"
import t from "../../../helpers/translator"

const WhatToExpect = () => {
  return (
    <section className="aside-block -mx-4 pt-0 md:mx-0 md:pt-4">
      <h4 className="text-caps-underline">{t("whatToExpect.label")}</h4>

      <p className="text-tiny text-gray-800">{t("whatToExpect.applicantsWillBeContacted")}</p>

      <details className="disclosure">
        <summary>read more</summary>

        <p className="text-tiny text-gray-800">{t("whatToExpect.allInfoWillBeVerified")}</p>

        <p className="text-tiny text-gray-800">{t("whatToExpect.bePreparedIfChosen")}</p>
      </details>
    </section>
  )
}

export { WhatToExpect as default, WhatToExpect }
