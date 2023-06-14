import React, { useContext } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { ApplicationContext } from "../../ApplicationContext"

const DetailsTerms = () => {
  const application = useContext(ApplicationContext)

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.review.terms.title")}
      inset
      grid={false}
    >
      <GridCell>
        <FieldValue
          label={t("application.details.signatureOnTerms")}
          data-testid="signatureOnTerms"
        >
          {(() => {
            if (application.acceptedTerms === null) {
              return t("t.n/a")
            } else if (application.acceptedTerms) {
              return t("t.yes")
            } else {
              return t("t.no")
            }
          })()}
        </FieldValue>
      </GridCell>
    </GridSection>
  )
}

export { DetailsTerms as default, DetailsTerms }
