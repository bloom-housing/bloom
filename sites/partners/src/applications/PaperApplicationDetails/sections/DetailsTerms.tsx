import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { DetailsApplicationContext } from "../DetailsApplicationContext"

const DetailsTerms = () => {
  const application = useContext(DetailsApplicationContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.review.terms.title")}
      inset
      grid={false}
    >
      <GridCell>
        <ViewItem label={t("application.details.signatureOnTerms")}>
          {(() => {
            if (application.acceptedTerms === null) {
              return t("t.n/a")
            } else if (application.acceptedTerms) {
              return t("t.yes")
            } else {
              return t("t.no")
            }
          })()}
        </ViewItem>
      </GridCell>
    </GridSection>
  )
}

export { DetailsTerms as default, DetailsTerms }
