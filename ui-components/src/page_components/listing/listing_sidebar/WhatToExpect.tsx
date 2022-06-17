import * as React from "react"
import { t } from "../../../helpers/translator"
import { Listing } from "@bloom-housing/backend-core/types"

interface WhatToExpectProps {
  listing: Listing
}

const WhatToExpect = (props: WhatToExpectProps) => {
  const listing = props.listing

  return (
    <section className="aside-block">
      <h4 className="text-caps-underline">{t("whatToExpect.label")}</h4>
      <p className="text-tiny text-gray-800">
        {listing.whatToExpect ? listing.whatToExpect : t("whatToExpect.default")}
      </p>
    </section>
  )
}

export { WhatToExpect as default, WhatToExpect }
