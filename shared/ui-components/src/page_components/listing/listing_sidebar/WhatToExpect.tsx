import * as React from "react"
import t from "../../../helpers/translator"
import { Listing } from "@bloom-housing/core"

interface WhatToExpectProps {
  listing: Listing
}

const WhatToExpect = (props: WhatToExpectProps) => {
  const listing = props.listing
  const applicantsWillBeContacted = listing?.whatToExpect?.applicantsWillBeContacted
  const allInfoWillBeVerified = listing?.whatToExpect?.allInfoWillBeVerified
  const bePreparedIfChosen = listing?.whatToExpect?.bePreparedIfChosen

  return (
    <section className="aside-block -mx-4 pt-0 md:mx-0 md:pt-4">
      <h4 className="text-caps-underline">{t("whatToExpect.label")}</h4>

      {/* Make sure an empty string is rendered */}
      {applicantsWillBeContacted || applicantsWillBeContacted == "" ? (
        <p className="text-tiny text-gray-800">{applicantsWillBeContacted}</p>
      ) : (
        <p className="text-tiny text-gray-800">{t("whatToExpect.applicantsWillBeContacted")}</p>
      )}

      <details className="disclosure">
        <summary>read more</summary>

        {allInfoWillBeVerified || allInfoWillBeVerified == "" ? (
          <p className="text-tiny text-gray-800">{allInfoWillBeVerified}</p>
        ) : (
          <p className="text-tiny text-gray-800">{t("whatToExpect.allInfoWillBeVerified")}</p>
        )}
        {bePreparedIfChosen || bePreparedIfChosen == "" ? (
          <p className="text-tiny text-gray-800">{bePreparedIfChosen}</p>
        ) : (
          <p className="text-tiny text-gray-800">{t("whatToExpect.bePreparedIfChosen")}</p>
        )}
      </details>
    </section>
  )
}

export { WhatToExpect as default, WhatToExpect }
