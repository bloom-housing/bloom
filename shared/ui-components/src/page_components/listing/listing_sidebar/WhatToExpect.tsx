import * as React from "react"
import t from "../../../helpers/translator"
import { Listing } from "@bloom-housing/core"

interface WhatToExpectProps {
  listing: Listing
}

const WhatToExpect = (props: WhatToExpectProps) => {
  const listing = props.listing
  return (
    <section className="aside-block -mx-4 pt-0 md:mx-0 md:pt-4">
      <h4 className="text-caps-underline">{t("whatToExpect.label")}</h4>

      <p className="text-tiny text-gray-800">
        {listing.whatToExpect?.applicantsWillBeContacted ||
          t("whatToExpect.applicantsWillBeContacted")}
      </p>

      <details className="disclosure">
        <summary>read more</summary>

        <p className="text-tiny text-gray-800">
          {listing.whatToExpect?.allInfoWillBeVerified || t("whatToExpect.allInfoWillBeVerified")}
        </p>

        <p className="text-tiny text-gray-800">
          {listing.whatToExpect?.bePreparedIfChosen || t("whatToExpect.bePreparedIfChosen")}
        </p>
      </details>
    </section>
  )
}

export { WhatToExpect as default, WhatToExpect }
