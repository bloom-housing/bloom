import * as React from "react"
import t from "../../../helpers/translator"

const WhatToExpect = () => {
  return (
    <section className="border-b border-gray-400 py-3 my-2 md:py-5 md:my-0 md:px-5 mx-5 md:mx-0">
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
