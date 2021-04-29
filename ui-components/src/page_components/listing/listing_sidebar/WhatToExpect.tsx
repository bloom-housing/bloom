import * as React from "react"
import { t } from "../../../helpers/translator"
import { Listing } from "@bloom-housing/backend-core/types"

interface WhatToExpectProps {
  listing: Listing
}

const WhatToExpect = (props: WhatToExpectProps) => {
  const listing = props.listing
  let applicantsWillBeContacted = listing.whatToExpect?.applicantsWillBeContacted
  let allInfoWillBeVerified = listing.whatToExpect?.allInfoWillBeVerified
  let bePreparedIfChosen = listing.whatToExpect?.bePreparedIfChosen

  applicantsWillBeContacted =
    applicantsWillBeContacted || applicantsWillBeContacted == ""
      ? applicantsWillBeContacted
      : t("whatToExpect.applicantsWillBeContacted")

  allInfoWillBeVerified =
    allInfoWillBeVerified || allInfoWillBeVerified == ""
      ? allInfoWillBeVerified
      : t("whatToExpect.allInfoWillBeVerified")

  bePreparedIfChosen =
    bePreparedIfChosen || bePreparedIfChosen == ""
      ? bePreparedIfChosen
      : t("whatToExpect.bePreparedIfChosen")

  return (
    <section className="aside-block">
      <h4 className="text-caps-underline">{t("whatToExpect.label")}</h4>
      <p className="text-tiny text-gray-800">{applicantsWillBeContacted}</p>
      <details className="disclosure">
        <summary>read more</summary>
        <p className="text-tiny text-gray-800">{allInfoWillBeVerified}</p>
        <p className="text-tiny text-gray-800">{bePreparedIfChosen}</p>
      </details>
    </section>
  )
}

export { WhatToExpect as default, WhatToExpect }
